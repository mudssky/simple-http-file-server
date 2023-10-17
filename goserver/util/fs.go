package util

import (
	"io/fs"
	"os"
	"path"
)

//	@function:		PathExists
//	@description:	文件目录是否存在
//	@param:			path string
//	@return:		bool, error
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

type ExploreDirOption struct {
	RootPath          string   `yaml:"rootPath"`      // 目标根目录
	IgnorePatternList []string `yaml:"ignorePattern"` // 忽略路径,采用shell文件名模式匹配，在windows下\\会被当作路径分隔符
}

func ExploreDir(option ExploreDirOption, fn fs.WalkDirFunc) error {
	filelist, err := os.ReadDir(option.RootPath)
	if err != nil {
		return err
	}
	for _, ff := range filelist {
		currentpath := path.Join(option.RootPath, ff.Name())
		if len(option.IgnorePatternList) > 0 {
			matched, err := MatchReList(option.IgnorePatternList, currentpath)
			if err != nil {
				return err
			}
			// 匹配到的项目跳过
			if matched {
				continue
			}
		}
		err = fn(currentpath, ff, nil)
		if err != nil {
			return err
		}
		if ff.IsDir() {
			ExploreDir(ExploreDirOption{
				RootPath:          currentpath,
				IgnorePatternList: option.IgnorePatternList,
			}, func(path string, d fs.DirEntry, err error) error {
				return fn(path, d, err)
			})
		}
	}
	return nil

}
