package response

// 文件信息
// @Description 文件信息
type FileInfo struct {
	Name        string `json:"name"`        // 文件名
	LastModTime int64  `json:"lastModTime"` //上次修改时间,单位为毫秒
	Path        string `json:"path"`        //路径
	IsFolder    bool   `json:"isFolder"`    //是否是文件夹
	Size        int64  `json:"size"`        //文件大小
}
