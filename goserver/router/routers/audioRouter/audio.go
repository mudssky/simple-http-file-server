package audioRouter

// 服务器主机信息相关的api

import (
	"github.com/gin-gonic/gin"
	"github.com/mudssky/simple-http-file-server/goserver/api"
)

type Router struct{}

func (f *Router) InitRouter(Router *gin.RouterGroup) {
	privateGroup := Router.Group("audio")
	api := api.ApiGroupApp.AudioApi
	{
		privateGroup.POST("/audioInfo", api.AudioInfo)
		privateGroup.POST("/playAudio", api.PlayAudio)
	}
}
