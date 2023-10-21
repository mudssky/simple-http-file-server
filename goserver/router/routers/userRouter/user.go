package userRouter

import (
	"github.com/gin-gonic/gin"
	"github.com/mudssky/simple-http-file-server/goserver/api"
)

type Router struct{}

func (r *Router) InitRouter(Router *gin.RouterGroup) {
	publicGroup := Router.Group("user")
	api := api.ApiGroupApp.UserAPI
	{
		publicGroup.POST("/login", api.Login)
		publicGroup.GET("/getWebpermission", api.GetWebpermission)
	}
}
