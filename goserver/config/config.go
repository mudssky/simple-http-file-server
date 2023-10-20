package config

// mapstructure 是viper unmarshaling 用到的标签 ,用的这个库 github.com/mitchellh/mapstructure

type Server struct {
	// 可以命令行传入的参数
	// 配置文件路径
	Config     string   `mapstructure:"config"  json:"config" yaml:"config"`
	Open       bool     `mapstructure:"open" json:"open" yaml:"open"`
	Verbose    bool     `mapstructure:"verbose" json:"verbose" yaml:"verbose"`
	Port       int      `mapstructure:"port" json:"port" yaml:"port" validate:"max=65535,min=0"`
	Loglevel   string   `mapstructure:"loglevel" json:"loglevel" yaml:"loglevel" validate:"oneof=debug info warn error dpanic panic fatal" `
	FolderList []string `mapstructure:"folderlist" json:"folderlist" yaml:"folderlist"`

	// 服务器相关
	Mode         string `mapstructure:"mode" json:"mode" yaml:"mode" validate:"oneof=debug release test"`
	RouterPrefix string `mapstructure:"router-prefix" json:"router-prefix" yaml:"router-prefix"`
	//是否检查更新
	CheckUpdate   bool          `mapstructure:"check-update" json:"check-update" yaml:"check-update"`
	Zap           Zap           `mapstructure:"zap" json:"zap" yaml:"zap"`
	UserList      []User        `mapstructure:"userlist" json:"userlist" yaml:"userlist"`
	JWT           JWT           `mapstructure:"jwt" json:"jwt" yaml:"jwt"`
	WebPermission WebPermission `mapstructure:"webpermission" json:"webpermission" yaml:"webpermission"`
	Security      Security      `mapstructure:"security" json:"security" yaml:"security"`
}
