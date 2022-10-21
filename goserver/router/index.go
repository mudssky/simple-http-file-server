package router

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/mudssky/simple-http-file-server/goserver/global"
	"github.com/mudssky/simple-http-file-server/goserver/middleware"
)

func InitRouter() *gin.Engine {
	var l = global.Logger
	var r = gin.New()
	r.Use(middleware.ZapLogger(), middleware.ZapRecovery(true))
	// r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})

	})
	// GET local
	r.GET("/files", func(ctx *gin.Context) {
		path := ctx.Query("path")
		l.Debug("path:" + path)
	})

	return r

}
