package global

import (
	"path"

	"github.com/mudssky/simple-http-file-server/goserver/util"
)

// 检查配置文件，是否有文件路径最后一级目录重复
func ValidateFoldernameDup() {
	var folderNameList []string
	for _, folderpath := range Config.FolderList {
		folderNameList = append(folderNameList, path.Base(folderpath))
	}
	if util.HasDup(folderNameList) {
		Logger.Fatal("文件夹的名称不能重复")
	}

}
