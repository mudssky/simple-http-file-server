package api

type ApiGroup struct {
	FileListAPI FileListAPI
	ServerAPI   ServerAPI
	UserAPI     UserAPI
	VideoAPI    VideoAPI
}

var ApiGroupApp = new(ApiGroup)
