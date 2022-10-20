package global

import (
	"fmt"
	"os"

	"github.com/fsnotify/fsnotify"
	"github.com/mudssky/simple-http-file-server/goserver/cmd"
	"github.com/mudssky/simple-http-file-server/goserver/config"
	"github.com/mudssky/simple-http-file-server/goserver/util"
	"github.com/spf13/viper"
	"go.uber.org/zap"
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

func initViper() {
	Viper = viper.GetViper()
	rootCmd := cmd.InitFlag()
	viper.BindPFlags(rootCmd.Flags())
	viper.AddConfigPath(".")
	viper.SetConfigName("config")
	if viper.GetString("config") != "" {
		fmt.Println("命令行设置配置文件：", viper.GetString("config"), viper.AllSettings())
		viper.SetConfigFile(viper.GetString("config"))
	}
	// viper.AutomaticEnv()
	// viper.SetEnvPrefix("GFS")
	// viper.BindEnv("port")
	err := viper.ReadInConfig() // 查找并读取配置文件
	if err != nil {             // 处理读取配置文件的错误
		fmt.Println("未找到配置文件,当前读取到的配置为:", viper.AllSettings())
	}
	loadViper()
	viper.WatchConfig()
	viper.OnConfigChange(func(e fsnotify.Event) {
		fmt.Println("配置文件变动：", e)
		loadViper()
		fmt.Println("当前配置", Config)
	})
}

func initLogger() {
	logger, _ := zap.NewProduction()
	defer logger.Sync() // flushes buffe
}

// 当前viper配置转为结构体
func loadViper() {
	if err := Viper.Unmarshal(&Config); err != nil {
		fmt.Println(err)
	}
}

func initZap() {
	if ok, _ := util.PathExists(Config.Zap.Directory); !ok { // 判断是否有Director文件夹
		fmt.Printf("create %v directory\n", Config.Zap.Directory)
		_ = os.Mkdir(Config.Zap.Directory, os.ModePerm)
	}
	Logger, _ = zap.NewProduction()
	// cores := internal.Zap.GetZapCores()
	// logger = zap.New(zapcore.NewTee(cores...))

	// if global.GVA_CONFIG.Zap.ShowLine {
	// 	logger = logger.WithOptions(zap.AddCaller())
	// }
	// return logger
}
