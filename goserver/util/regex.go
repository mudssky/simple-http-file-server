package util

import (
	"path/filepath"
	"regexp"
)

// 匹配列表，如果有一个匹配的结果就返回true，都不匹配返回才是false
func MatchReList(patternList []string, s string) (matched bool, err error) {
	for _, p := range patternList {
		matched, err = regexp.MatchString(p, s)
		if err != nil || matched {
			break
		}
	}
	return matched, err
}

// 使用filepath.Match匹配路径,这个方法采用shell的路径匹配模式，但是有些语法还没有实现，所以现在凑合用了
func MatchPathList(patternList []string, path string) (matched bool, err error) {
	for _, p := range patternList {
		matched, err = filepath.Match(p, path)
		if err != nil || matched {
			break
		}
	}
	return matched, err
}
