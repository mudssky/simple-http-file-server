package global

import (
	_ "embed"
	"fmt"
	"log"
	"os"
	"path"
	"strings"
	"time"

	"github.com/casbin/casbin/v2"
	"github.com/casbin/casbin/v2/model"
	"github.com/fsnotify/fsnotify"
	"github.com/go-playground/validator/v10"
	"github.com/joho/godotenv"
	"github.com/mudssky/simple-http-file-server/goserver/cmd"
	"github.com/mudssky/simple-http-file-server/goserver/config"
	"github.com/mudssky/simple-http-file-server/goserver/sysinfo"
	"github.com/mudssky/simple-http-file-server/goserver/util"
	"github.com/mudssky/simple-http-file-server/goserver/version"
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
	SystemInfo     *sysinfo.SystemInfo
)

func InitGlobalConfig() {
	// 初始化viper，读取各种配置
	initViper()
	// 手动校验配置信息
	validateConfig()
	// 初始化zap logger
	initZap()
	// 初始化 casbin
	initCasbin()
}

// 加载.env文件到全局变量
func loadDotenv() {
	err := godotenv.Load()
	if err != nil {
		// 开启verbose后显示更多信息
		if Viper.GetBool("verbose") {
			fmt.Println("log dotenv error:", err.Error())
		}
	}
}

func initViper() {

	Viper = viper.GetViper()
	rootCmd := cmd.InitFlag()
	err := viper.BindPFlags(rootCmd.Flags())
	if err != nil {
		log.Fatalln("bind flags failed:", err.Error())
	}
	// 获取系统相关信息，接下来检查更新要用到
	SystemInfo, err = sysinfo.Info()
	if err != nil {
		log.Fatalln("get system info error: ", err.Error())
	}

	// 执行更新命令
	if viper.GetBool("update") {
		version.Update(SystemInfo)
	} else {
		if viper.GetBool("check-update") {
			err := version.NotifyUpdate()
			if err != nil {
				log.Fatalln("notify update error:", err.Error())
			}
		}
	}

	viper.AddConfigPath(".")
	// windows下面路径分隔符是反斜杠
	// homepath, err := homedir.Dir()
	// if err != nil {
	// 	log.Fatalln("get home dir error: ", err.Error())
	// }
	// SystemInfo.Path, err = os.UserHomeDir()
	// if err != nil {
	// 	log.Fatalln("get home dir error: ", err.Error())
	// }

	homeconfigPath := path.Join(SystemInfo.HomePath, ".ghs")
	configname := "ghs"
	// fmt.Println("homedir:", homepath)
	viper.AddConfigPath(homeconfigPath)
	viper.SetConfigName(configname)
	loadDotenv()
	if viper.GetBool("verbose") {
		fmt.Println("home dir:", SystemInfo.HomePath)
	}
	// 读取命令行中的配置文件路径
	if configpath := viper.GetString("config"); configpath != "" {
		fmt.Println("命令行设置配置文件：", configpath, viper.AllSettings())
		viper.SetConfigFile(configpath)
	}
	viper.AutomaticEnv()
	// viper.SetEnvPrefix("GFS")
	// err = viper.BindEnv("port")
	// if err != nil {
	// 	log.Fatalln("bind port failed:", err.Error())
	// }
	// 先读取内嵌默认配置
	err = viper.ReadConfig(strings.NewReader(defaultConfig))
	if err != nil {
		log.Fatalln("读取内嵌默认配置失败", err.Error())
	}
	if Viper.GetBool("verbose") {
		loadViper()
		fmt.Printf("default config:%#v\n", Config)
	}
	// 然后用用户的配置文件进行覆盖
	err = viper.MergeInConfig()
	// err = viper.ReadInConfig() // 查找并读取配置文件
	if err != nil { // 处理读取配置文件的错误
		//  err.(viper.ConfigFileNotFoundError)
		switch t := err.(type) {
		// 配置文件没找到的情况下不进行处理,采用内置配置文件
		case viper.ConfigFileNotFoundError:
			if Viper.GetBool("verbose") {
				fmt.Println("user config file not found:", t.Error())
			}
			// 找不到的情况,写入默认配置到用户目录
			isExist, err := util.PathExists(SystemInfo.HomePath)
			if err != nil {
				log.Fatalln("check homepath failed:", err.Error())
			}
			if !isExist {
				err := os.MkdirAll(SystemInfo.HomePath, os.ModeDir)
				if err != nil {
					log.Fatalln("create home path failed:", err.Error())
				}
			}
			homeconfigfilePath := path.Join(homeconfigPath, configname+".yaml")
			err = os.WriteFile(homeconfigfilePath, []byte(defaultConfig), os.ModePerm)
			if err != nil {
				log.Fatalln("create home path config failed:", err.Error())
			}

		default:
			log.Fatalln("merge config file failed:", t.Error())
		}

	}
	loadViper()
	viper.WatchConfig()
	viper.OnConfigChange(func(e fsnotify.Event) {
		fmt.Println("配置文件变动：", e)
		loadViper()
		// fmt.Println("当前配置", Config)
		fmt.Printf("当前配置:%+v\n", Config)
	})
	if Viper.GetBool("verbose") {
		fmt.Println("所有配置：", viper.AllSettings())
		fmt.Printf("merged config:%#v\n", Config)
		viper.Debug()
	}
	// 处理命令行参数相关的执行
	excuteCMd()
}

func excuteCMd() {
	// 处理打开浏览器
	if Config.Open {
		go func() {
			// time.Sleep(time.Second)
			err := util.Open("http://127.0.0.1:" + fmt.Sprintf("%d", Config.Port))
			if err != nil {
				log.Fatalln("open brower failed", err.Error())
				// os.Exit(1)
			}

		}()
	}
}

// 当前viper配置加载到结构体
func loadViper() {

	if err := Viper.Unmarshal(&Config); err != nil {
		log.Fatalln("loadViper failed:", err)
	}
	// 校验配置文件
	validate := validator.New()
	err := validate.Struct(&Config)
	if err != nil {
		log.Fatalln("config validate failed:", err.Error())
	}
	// 处理zap相关配置
	// 日志文件默认写入用户目录和配置文件放在一起
	if Config.Zap.Filename == "" {
		homeconfigPath := path.Join(SystemInfo.HomePath, ".ghs")
		Config.Zap.Filename = path.Join(homeconfigPath, "ghs.log")
	}
	// usermap := Viper.GetString("usermap")
	// fmt.Printf("usermap:%s\n", usermap)
	// if usermap != "" {
	// 	user := config.User{}
	// 	var json = jsoniter.ConfigCompatibleWithStandardLibrary
	// 	err := json.Unmarshal([]byte(usermap), &user)
	// 	if err != nil {
	// 		log.Fatalln("usermap parse failed:", err.Error(), usermap)
	// 	}
	// 	if err := validate.Struct(user); err != nil {
	// 		log.Fatalln("usermap validate failed:", err.Error())
	// 	}
	// 	Config.UserList = append(Config.UserList, user)
	// }

}
func initCasbin() {
	if Viper.GetBool("verbose") {
		fmt.Println("casbin:", casbinModalStr)
		fmt.Println("casbin policy:", policyCSV)
	}

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
	// lowPriority := zap.LevelEnablerFunc(func(lvl zapcore.Level) bool {
	// 	return lvl < zapcore.ErrorLevel
	// })

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
		// zapcore.NewCore(consoleEncoder, consoleDebugging, lowPriority),
		zapcore.NewCore(consoleEncoder, consoleDebugging, zap.LevelEnablerFunc(func(l zapcore.Level) bool {
			// 配置console loglevel
			return l >= util.TransportZapLevel(Config.Loglevel)
		})),
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
