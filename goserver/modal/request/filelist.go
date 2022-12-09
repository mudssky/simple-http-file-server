package request

// 获取文件列表时传入的路径，空路径表示根列表
type FilePath struct {
	Path string `json:"path"` // 路径
}

// 需要执行操作时传入的路径
type OprateFilePath struct {
	Path string `json:"path" binding:"required"` // 路径
}

// 创建Txt文件需要的参数
type TxtFile struct {
	Path    string `json:"path"`    //创建文本文件的路径
	Content string `json:"content"` //内容
}

// 重命名一个文件需要的参数
type Rename struct {
	Path    string `json:"path"`
	NewName string `json:"newName"`
}
