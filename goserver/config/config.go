package config

type Server struct {
	Port uint16
	Zap  Zap `mapstructure:"zap" json:"zap" yaml:"zap"`
}
