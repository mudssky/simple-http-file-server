package request

// 获取指定路径的音频列表
type AudioListReq struct {
	Path string `json:"path" binding:"required,path_exist"` // 路径
}
