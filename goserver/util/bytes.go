package util

import (
	"fmt"
	"strconv"
	"strings"
)

// 根据文件大小输出不同单位
func FileSizeFormatter(filesize int64, decimalPlaces int) string {
	sizeDict := map[string]int64{
		"b":  1,
		"kb": 1 << 10,
		"mb": 1 << 20,
		"gb": 1 << 30,
		"tb": 1 << 40,
		"pb": 1 << 50,
	}
	var unit string
	if filesize >= sizeDict["pb"] {
		unit = "PB"
	} else if filesize >= sizeDict["tb"] {
		unit = "TB"
	} else if filesize >= sizeDict["gb"] {
		unit = "GB"
	} else if filesize >= sizeDict["mb"] {
		unit = "MB"
	} else if filesize >= sizeDict["kb"] {
		unit = "KB"
	} else {
		unit = "B"
	}
	result := filesize / sizeDict[strings.ToLower(unit)]
	resStr := Itoa(result)
	formatStr := "%d" + unit
	if strings.Contains(resStr, ".") {
		formatStr = "%." + strconv.Itoa(decimalPlaces) + "f" + unit
	}
	return fmt.Sprintf(formatStr, result)
}
