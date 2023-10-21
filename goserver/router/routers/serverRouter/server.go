package serverRouter

// 服务器主机信息相关的api

import (
	"github.com/gin-gonic/gin"
	"github.com/mudssky/simple-http-file-server/goserver/api"
)

type Router struct{}

func (f *Router) InitRouter(Router *gin.RouterGroup) {
	publicGroup := Router.Group("server")
	api := api.ApiGroupApp.ServerAPI
	{
		publicGroup.GET("/getServerInfo", api.GetServerInfo)
	}

}
