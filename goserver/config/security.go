package config

type Security struct {
	IPWhitelist []string `json:"ip_whitelist"`
	TrustLan    bool     `json:"trust_lan"`
}
