package util

import (
	"fmt"
)

type Signed interface {
	~int | ~int8 | ~int16 | ~int32 | ~int64
}

type Unsigned interface {
	~uint | ~uint8 | ~uint16 | ~uint32 | ~uint64 | ~uintptr
}

type Integer interface {
	Signed | Unsigned
}

type Float interface {
	~float32 | ~float64
}

type Number interface {
	Integer | Float
}

// 转换整数为字符串
func Itoa[T Integer](num T) string {
	// Sprintf使用反射效率比较低，以后应该还有优化空间
	return fmt.Sprintf("%d", num)
}
