package request

// 传入路径的请求
type FilePath struct {
	Path string `json:"path" validate:"required"` // 路径
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
