package config

type Server struct {
	Port       uint16
	Zap        Zap      `mapstructure:"zap" json:"zap" yaml:"zap"`
	FolderList []string `mapstructure:"folderlist" json:"folderlist" yaml:"folderlist"`
	UserList   []User   `mapstructure:"userlist" json:"userlist" yaml:"userlist"`
	Jwt        JWT      `mapstructure:"jwt" json:"jwt" yaml:"jwt"`
}
