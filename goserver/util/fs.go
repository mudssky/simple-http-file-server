package util

import (
	"os"
	"path"
)

// @function: PathExists
// @description: 文件目录是否存在
// @param: path string
// @return: bool, error
func PathExists(path string) (bool, error) {
	_, err := os.Stat(path)
	// 报错的情况分两种，一种是文件不存在，另一种是其他报错
	if err != nil {
		if os.IsNotExist(err) {
			return false, nil
		}
		return false, err
	}

	return true, nil
}

// 这次错误就不进行处理了，获取报错的情况当作false
func IsFolder(path string) bool {
	f, err := os.Stat(path)
	if err != nil {
		return false
	}
	return f.IsDir()
}

// 从文件夹路径中获取文件夹的名字,传入的需要是文件夹路径
func FolderName(folderpath string) string {
	_, file := path.Split(folderpath)
	return file
}

// 检查字符串列表是否存在重复
func HasDup(list []string) bool {
	m := make(map[string]bool)
	for _, key := range list {
		_, ok := m[key]
		if ok {
			return true
		}
		m[key] = true
	}
	return false
}
