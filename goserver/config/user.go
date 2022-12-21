package config

type User struct {
	Username string `json:"username" yaml:"username"`
	Password string `json:"password" yaml:"password"`
	Role     string `json:"role" yaml:"role"`
}
