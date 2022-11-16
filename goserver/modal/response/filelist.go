package response

type FileInfo struct {
	Name string `json:"name"`
	// CreationTime   int64  `json:"createTime"`
	LastModTime int64  `json:"lastModTime"` //上次修改时间,单位为毫秒
	Path        string `json:"path"`
	IsFolder    bool   `json:"isFolder"`
	Size        int64  `json:"size"`
	// LastAccessTime int64  `json:"lastAccessTime"`
	// LastWriteTime  int64  `json:"lastWriteTime"`
}
