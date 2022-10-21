package global

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/fsnotify/fsnotify"
	"github.com/joho/godotenv"
	"github.com/mudssky/simple-http-file-server/goserver/cmd"
	"github.com/mudssky/simple-http-file-server/goserver/config"
	"github.com/spf13/viper"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	"gopkg.in/natefinch/lumberjack.v2"
)

var (
	Viper  *viper.Viper
	Logger *zap.Logger
	Config config.Server
)

func init() {
	initViper()
	initZap()
}

// 加载.env文件到全局变量
func loadDotenv() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}
func initViper() {
	osenv, _ := os.LookupEnv("PORT")
	fmt.Println("env:", osenv)
	loadDotenv()
	Viper = viper.GetViper()
	rootCmd := cmd.InitFlag()
	viper.BindPFlags(rootCmd.Flags())
	viper.AddConfigPath(".")
	viper.SetConfigName("config")
	if configpath := viper.GetString("config"); configpath != "" {
		fmt.Println("命令行设置配置文件：", configpath, viper.AllSettings())
		viper.SetConfigFile(configpath)
		// ioutil.ReadFile(configpath)
		// viper.ReadConfig()
	}
	viper.AutomaticEnv()
	// viper.SetEnvPrefix("GFS")
	viper.BindEnv("port")
	err := viper.ReadInConfig() // 查找并读取配置文件
	if err != nil {             // 处理读取配置文件的错误
		fmt.Println("未找到配置文件,当前读取到的配置为:", viper.AllSettings())
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
}

// 当前viper配置加载到结构体
func loadViper() {
	if err := Viper.Unmarshal(&Config); err != nil {
		fmt.Println(err)
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
