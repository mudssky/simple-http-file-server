package api

type ApiGroup struct {
	FileListAPI FileListAPI
	ServerAPI   ServerAPI
}

var ApiGroupApp = new(ApiGroup)
