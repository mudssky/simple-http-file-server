package api

type ApiGroup struct {
	FileListAPI FileListAPI
	ServerAPI   ServerAPI
	UserAPI     UserAPI
}

var ApiGroupApp = new(ApiGroup)
