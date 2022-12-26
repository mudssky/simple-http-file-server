package config

type Server struct {
	// 配置文件路径
	Config string `mapstructure:"config"  json:"config" yaml:"config"`
	// 命令行参数，是否打开浏览器
	Open    bool `mapstructure:"open" json:"open" yaml:"open"`
	Verbose bool `mapstructure:"verbose" json:"verbose" yaml:"verbose"`
	// 服务器模式
	Mode          string `mapstructure:"mode" json:"mode" yaml:"mode" validate:"oneof=debug release test"`
	Port          uint16
	Zap           Zap           `mapstructure:"zap" json:"zap" yaml:"zap"`
	Loglevel      string        `mapstructure:"loglevel" json:"loglevel" yaml:"loglevel" validate:"oneof=debug info warn error dpanic panic fatal" `
	FolderList    []string      `mapstructure:"folderlist" json:"folderlist" yaml:"folderlist"`
	UserList      []User        `mapstructure:"userlist" json:"userlist" yaml:"userlist"`
	Jwt           JWT           `mapstructure:"jwt" json:"jwt" yaml:"jwt"`
	WebPermission WebPermission `mapstructure:"webpermission" json:"webpermission" yaml:"webpermission"`
	Security      Security      `mapstructure:"security" json:"security" yaml:"security"`
}
