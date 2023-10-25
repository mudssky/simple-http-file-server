package global

import (
	"path"

	"github.com/mudssky/goutils"
)

// 检查配置文件，是否有文件路径最后一级目录重复
func ValidateFoldernameDup() {
	var folderNameList []string
	for _, folderpath := range Config.FolderList {
		folderNameList = append(folderNameList, path.Base(folderpath))
	}
	if goutils.HasDuplicates(folderNameList) {
		Logger.Fatal("文件夹的名称不能重复")
	}

}
