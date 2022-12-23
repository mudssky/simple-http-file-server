package config

type User struct {
	Username string `json:"username" yaml:"username" validate:"required"`
	Password string `json:"password" yaml:"password" validate:"required"`
	Role     string `json:"role" yaml:"role"`
}
