package config

type Security struct {
	IPWhitelist []string `mapstructure:"ip-whitelist" json:"ip-whitelist" yaml:"ip-whitelist"`
	TrustLan    bool     `mapstructure:"trust-lan" json:"trust-lan" yaml:"trust-lan"`
}
