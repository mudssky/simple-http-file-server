package api

type ApiGroup struct {
	FileListAPI FileListAPI
	ServerAPI   ServerAPI
	UserAPI     UserAPI
	VideoAPI    VideoAPI
	AudioApi    AudioApi
}

var ApiGroupApp = new(ApiGroup)
