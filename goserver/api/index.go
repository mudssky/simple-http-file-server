package api

type APIGroup struct {
	FileListAPI
	ServerAPI
	UserAPI
	VideoAPI
	AudioApi
}

var ApiGroupApp = new(APIGroup)
