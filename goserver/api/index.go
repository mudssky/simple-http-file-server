package api

type ApiGroup struct {
	FileListAPI FileListAPI
}

var ApiGroupApp = new(ApiGroup)
