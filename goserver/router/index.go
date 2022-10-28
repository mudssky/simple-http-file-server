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
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})

	})

	// fileListApi := new(api.FileListAPI)
	// GET local
	fileListAPI := api.ApiGroupApp.FileListAPI
	r.GET("/filelist", fileListAPI.GetFileList)

	return r

}
