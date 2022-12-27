package config

type User struct {
	Username string `mapstructure:"username"  json:"username" yaml:"username" validate:"required"`
	Password string `mapstructure:"password"  json:"password" yaml:"password" validate:"required"`
	Role     string `mapstructure:"role" json:"role" yaml:"role"`
}
