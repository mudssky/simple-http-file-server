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

	apiGroup := r.Group("/api")
	{
		// fileListApi := new(api.FileListAPI)
		// GET local
		fileListAPI := api.ApiGroupApp.FileListAPI
		apiGroup.POST("/filelist", fileListAPI.GetFileList)
		apiGroup.POST("/mkdir", fileListAPI.MakeDir)
		apiGroup.POST("/removeItem", fileListAPI.RemoveItem)
		apiGroup.POST("/createTxt", fileListAPI.CreateTxt)

		// 设置默认上传大小限制1gb（不设置的情况下默认是32gb）
		r.MaxMultipartMemory = 1 << 30
		apiGroup.POST("/uploadMulti", fileListAPI.UploadMulti)
		// r.POST("/uploadSingle", fileListAPI.UploadSingle)
	}

	return r

}
