package routers

import (
	"github.com/gin-gonic/gin"
	"github.com/mudssky/simple-http-file-server/goserver/api"
)

type FileListRouter struct{}

func (f *FileListRouter) InitFileListRouter(Router *gin.RouterGroup) {
	group := Router.Group("fileList")
	fileListAPI := api.ApiGroupApp.FileListAPI
	{
		group.POST("/filelist", fileListAPI.GetFileList)
		group.POST("/mkdir", fileListAPI.MakeDir)
		group.POST("/removeItem", fileListAPI.RemoveItem)
		group.POST("/createTxt", fileListAPI.CreateTxt)
		group.POST("/uploadMulti", fileListAPI.UploadMulti)
		group.POST("/renameItem", fileListAPI.RenameItem)
		group.POST("/downloadItem", fileListAPI.DownloadItem)
	}

}
