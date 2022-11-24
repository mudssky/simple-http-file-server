package router

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/mudssky/simple-http-file-server/goserver/api"
	"github.com/mudssky/simple-http-file-server/goserver/middleware"
)

func InitRouter() *gin.Engine {
	var r = gin.New()
	r.Use(middleware.ZapLogger(), middleware.ZapRecovery(true))
	// r := gin.Default()
	r.Use(middleware.Cors())
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})

	})

	// fileListApi := new(api.FileListAPI)
	// GET local
	fileListAPI := api.ApiGroupApp.FileListAPI
	r.POST("/filelist", fileListAPI.GetFileList)
	r.POST("/mkdir", fileListAPI.MakeDir)
	r.POST("/removeItem", fileListAPI.RemoveItem)
	r.POST("/createTxt", fileListAPI.CreateTxt)

	// 设置默认上传大小限制1gb（不设置的情况下默认是32gb）
	r.MaxMultipartMemory = 1 << 30
	r.POST("/uploadMulti", fileListAPI.UploadMulti)
	// r.POST("/uploadSingle", fileListAPI.UploadSingle)
	return r

}
