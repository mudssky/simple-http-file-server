package conf

import (
	_ "embed"
)

//go:embed  rabc_modal.conf
var CasbinModalStr string

//go:embed policy.csv
var PolicyCSV string

//go:embed config.yaml
var DefaultConfig string

//go:embed version
var Version string
