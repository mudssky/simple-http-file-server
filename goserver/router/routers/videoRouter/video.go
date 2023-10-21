package videoRouter

// 服务器主机信息相关的api

import (
	"github.com/gin-gonic/gin"
	"github.com/mudssky/simple-http-file-server/goserver/api"
)

type Router struct{}

func (f *Router) InitRouter(Router *gin.RouterGroup) {
	privateGroup := Router.Group("video")
	api := api.ApiGroupApp.ServerAPI
	{
		privateGroup.GET("/getVttSubtitle", api.GetServerInfo)
	}

}
