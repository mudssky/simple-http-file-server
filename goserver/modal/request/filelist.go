package request

type FileListReq struct {
	Path string `json:"path"` // 路径
}

// 新建文件夹的请求
type NewFolderReq struct {
	FolderPath string `json:"folderPath"` // 要创建的文件夹路径
}
