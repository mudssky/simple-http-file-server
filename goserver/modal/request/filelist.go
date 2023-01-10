package request

// 获取文件列表时传入的路径，空路径表示根列表
type FilePath struct {
	Path string `json:"path" binding:"omitempty,path_exist"` // 路径
}

// 需要执行操作时传入的路径
type OperateFilePath struct {
	Path string `json:"path" binding:"required,path_exist"` // 路径
}
type MkdirPath struct {
	Path string `json:"path" binding:"required,path_not_exist"` // 路径
}

// 创建Txt文件需要的参数
type TxtFile struct {
	Path    string `json:"path" binding:"required"` //创建文本文件的路径
	Content string `json:"content"`                 //内容
}

// 重命名一个文件需要的参数
type Rename struct {
	Path    string `json:"path" binding:"required,path_exist"`
	NewName string `json:"newName" binding:"required"`
}

type FileInfo struct {
	Name        string `json:"name"`                               // 文件名
	LastModTime int64  `json:"lastModTime"`                        //上次修改时间,单位为毫秒
	Path        string `json:"path" binding:"required,path_exist"` //路径
	IsFolder    bool   `json:"isFolder"`                           //是否是文件夹
	Size        int64  `json:"size"`                               //文件大小
	Link        string `json:"link"`                               //静态链接,文件夹则为空串
}
