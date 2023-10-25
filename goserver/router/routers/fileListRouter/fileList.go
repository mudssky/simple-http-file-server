package fileListRouter

import (
	"github.com/gin-gonic/gin"
	"github.com/mudssky/simple-http-file-server/goserver/api"
)

type Router struct{}

func (f *Router) InitRouter(Router *gin.RouterGroup) {
	privateGroup := Router.Group("fileList")
	api := api.ApiGroupApp.FileListAPI
	{
		privateGroup.POST("/filelist", api.GetFileList)
		privateGroup.POST("/mkdir", api.MakeDir)
		privateGroup.POST("/removeItem", api.RemoveItem)
		privateGroup.POST("/createTxt", api.CreateTxt)
		privateGroup.POST("/uploadMulti", api.UploadMulti)
		privateGroup.POST("/renameItem", api.RenameItem)
		privateGroup.POST("/downloadItem", api.DownloadItem)
	}

}
