package global

import (
	_ "embed"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"runtime"
	"strings"
	"time"

	"github.com/casbin/casbin/v2"
	"github.com/casbin/casbin/v2/model"
	"github.com/fsnotify/fsnotify"
	"github.com/go-playground/validator/v10"
	"github.com/joho/godotenv"
	"github.com/mudssky/simple-http-file-server/goserver/cmd"
	"github.com/mudssky/simple-http-file-server/goserver/config"
	"github.com/mudssky/simple-http-file-server/goserver/util"
	scas "github.com/qiangmzsx/string-adapter/v2"
	"github.com/spf13/viper"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	"gopkg.in/natefinch/lumberjack.v2"
)

//go:embed ..\rabc_modal.conf
var casbinModalStr string

//go:embed ..\policy.csv
var policyCSV string

//go:embed ..\config.yaml
var defaultConfig string

var (
	Viper          *viper.Viper
	Logger         *zap.Logger
	Config         config.Server
	CasbinEnforcer *casbin.Enforcer
)

func InitGlobalConfig() {
	initViper()
	initZap()
	validateConfig()
	initCasbin()
}

// 加载.env文件到全局变量
func loadDotenv() {
	err := godotenv.Load()
	if err != nil {
		// 开启verbose后显示更多信息
		if Viper.GetBool("verbose") {
			fmt.Println(err.Error())
		}
	}
}
func userHomeDir() string {
	if runtime.GOOS == "windows" {
		home := os.Getenv("HOMEDRIVE") + os.Getenv("HOMEPATH")
		if home == "" {
			home = os.Getenv("USERPROFILE")
		}
		return home
	}
	return os.Getenv("HOME")
}

func initViper() {
	loadDotenv()
	Viper = viper.GetViper()
	viper.AddConfigPath(".")
	// windows下面路径分隔符是反斜杠
	viper.AddConfigPath("$HOME\\.ghs")
	viper.SetConfigName("config")

	rootCmd := cmd.InitFlag()
	viper.BindPFlags(rootCmd.Flags())
	// 读取命令行中的配置文件路径
	if configpath := viper.GetString("config"); configpath != "" {
		fmt.Println("命令行设置配置文件：", configpath, viper.AllSettings())
		viper.SetConfigFile(configpath)
	}
	viper.MergeInConfig()
	viper.AutomaticEnv()
	// viper.SetEnvPrefix("GFS")
	viper.BindEnv("port")

	// 先读取内嵌默认配置
	err := viper.ReadConfig(strings.NewReader(defaultConfig))
	if err != nil {
		log.Fatalln("读取内嵌默认配置失败", err.Error())
	}

	// 然后用用户的配置文件进行覆盖
	err = viper.MergeInConfig()
	// err = viper.ReadInConfig() // 查找并读取配置文件
	if err != nil { // 处理读取配置文件的错误
		log.Fatalln("未找到配置文件:", err.Error())
	}

	if err := Viper.Unmarshal(&Config); err != nil {
		log.Fatalln("反序列化配置文件失败：", err.Error())
	}
	loadViper()
	viper.WatchConfig()
	viper.OnConfigChange(func(e fsnotify.Event) {
		fmt.Println("配置文件变动：", e)
		loadViper()
		// fmt.Println("当前配置", Config)
		fmt.Printf("当前配置:%+v\n", Config)
	})
	fmt.Println("命令行设置配置文件：", viper.AllSettings())
	excuteCMd()
}

func excuteCMd() {
	if Viper.GetBool("open") {
		go func() {
			// time.Sleep(time.Second)
			err := util.Open("http://127.0.0.1:" + fmt.Sprintf("%d", Config.Port))
			if err != nil {
				log.Fatalln(err)
				os.Exit(1)
			}

		}()
	}

}

// 当前viper配置加载到结构体
func loadViper() {
	var validate *validator.Validate
	if err := Viper.Unmarshal(&Config); err != nil {
		fmt.Println(err)
	}

	usermap := Viper.GetString("usermap")
	if usermap != "" {
		user := config.User{}
		err := json.Unmarshal([]byte(usermap), &user)
		if err != nil {
			log.Fatalln("usermap parse failed:", err.Error(), usermap)
		}
		if err := validate.Struct(user); err != nil {
			log.Fatalln("usermap validate failed:", err.Error())
		}
		Config.UserList = append(Config.UserList, user)
	}

}
func initCasbin() {
	fmt.Println("casbin:", casbinModalStr)
	fmt.Println("casbin policy:", policyCSV)
	m, err := model.NewModelFromString(casbinModalStr)
	if err != nil {
		log.Fatalln("读取casbin modal配置文件失败:", err.Error())
	}
	sa := scas.NewAdapter(policyCSV)
	CasbinEnforcer, err = casbin.NewEnforcer(m, sa)
	if err != nil {
		log.Fatalln("casbin 初始化失败", err.Error())
	}
}
func initZap() {
	// The bundled Config struct only supports the most common configuration
	// options. More complex needs, like splitting logs between multiple files
	// or writing to non-file outputs, require use of the zapcore package.
	//
	// In this example, imagine we're both sending our logs to Kafka and writing
	// them to the console. We'd like to encode the console output and the Kafka
	// topics differently, and we'd also like special treatment for
	// high-priority logs.

	// First, define our level-handling logic.
	highPriority := zap.LevelEnablerFunc(func(lvl zapcore.Level) bool {
		return lvl >= zapcore.ErrorLevel
	})
	lowPriority := zap.LevelEnablerFunc(func(lvl zapcore.Level) bool {
		return lvl < zapcore.ErrorLevel
	})

	// High-priority output should also go to standard error, and low-priority
	// output should also go to standard out.
	consoleDebugging := zapcore.Lock(os.Stdout)
	consoleErrors := zapcore.Lock(os.Stderr)
	zapConfig := zapcore.EncoderConfig{
		MessageKey:    "message",
		LevelKey:      "level",
		TimeKey:       "time",
		NameKey:       "logger",
		CallerKey:     "caller",
		StacktraceKey: Config.Zap.StacktraceKey,
		LineEnding:    zapcore.DefaultLineEnding,
		EncodeLevel:   Config.Zap.ZapEncodeLevel(),
		EncodeTime: func(t time.Time, pae zapcore.PrimitiveArrayEncoder) {
			pae.AppendString(Config.Zap.Prefix + t.Format("2006/01/02 - 15:04:05.000"))
		},
		EncodeDuration: zapcore.SecondsDurationEncoder,
		EncodeCaller:   zapcore.FullCallerEncoder,
	}
	fileWriteSync := zapcore.AddSync(&lumberjack.Logger{
		Filename:   Config.Zap.Filename,
		MaxSize:    Config.Zap.MaxSize, // megabytes
		MaxBackups: Config.Zap.MaxBackups,
		MaxAge:     Config.Zap.MaxAge, // days
	})

	// Optimize the Kafka output for machine consumption and the console output
	// for human operators.
	// fileEncoder := zapcore.NewJSONEncoder(zap.NewProductionEncoderConfig())
	// fileEncoder := zapcore.NewJSONEncoder(zapConfig)
	fileEncoder := zapcore.NewConsoleEncoder(zapConfig)
	consoleEncoder := zapcore.NewConsoleEncoder(zapConfig)

	// Join the outputs, encoders, and level-handling functions into
	// zapcore.Cores, then tee the four cores together.
	core := zapcore.NewTee(
		zapcore.NewCore(fileEncoder, fileWriteSync, Config.Zap.GetLevelPriority()),
		zapcore.NewCore(consoleEncoder, consoleDebugging, lowPriority),
		zapcore.NewCore(consoleEncoder, consoleErrors, highPriority),
	)

	// From a zapcore.Core, it's easy to construct a Logger.
	Logger = zap.New(core)
	defer Logger.Sync()
	Logger.Info("constructed a logger")
}

func validateConfig() {
	ValidateFoldernameDup()
}
