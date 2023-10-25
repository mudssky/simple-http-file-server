package router

import (
	"embed"
	"encoding/base64"
	"io/fs"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/mudssky/simple-http-file-server/goserver/global"
	"github.com/mudssky/simple-http-file-server/goserver/middleware"
	"github.com/mudssky/simple-http-file-server/goserver/modal/response"
	"github.com/mudssky/simple-http-file-server/goserver/router/routers"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

var l = global.Logger

func locateFileSystem(webAssets embed.FS, dir string) http.FileSystem {
	fsys, err := fs.Sub(webAssets, dir)
	if err != nil {
		panic(err)
	}
	return http.FS(fsys)
}
func initSwagger(r *gin.Engine) {
	// 发布版本不显示文档
	if global.Config.Mode != "release" {
		// 文档路由
		r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	}
}
func initStaticRouter(r *gin.Engine, webAssets embed.FS) {
	// 遍历生成静态文件目录
	for _, folderPath := range global.Config.FolderList {
		// 使用url安全的base64根据路径生成静态服务前缀
		l.Debug("static path: /static/" + base64.RawURLEncoding.EncodeToString([]byte(folderPath)))
		r.StaticFS("/static/"+base64.RawURLEncoding.EncodeToString([]byte(folderPath)), http.Dir(folderPath))

	}
	// html和静态文件路由
	r.StaticFS("/assets/", locateFileSystem(webAssets, "public/assets"))
	r.GET("/", func(c *gin.Context) {
		htmlByte, err := webAssets.ReadFile("public/index.html")
		if err != nil {
			response.FailWithMessage(err.Error(), c)
		}
		c.Data(http.StatusOK, "text/html; charset=utf-8", htmlByte)
	})
}

func InitRouter(webAssets embed.FS) *gin.Engine {

	RouterGroupApp := routers.RouterGroupApp
	var r = gin.New()

	r.Use(middleware.ZapLogger(), middleware.ZapRecovery(true))
	r.Use(middleware.IPLimit())
	// 这个设置信用代理，似乎影响的是ClientIP()获取ip的过程，设为nil之后就会直接返回remoteIP
	// 似乎是有Nginx之类做代理的时候，通过header转发被代理的ip时需要设置一下
	r.SetTrustedProxies(nil)
	// r.SetTrustedProxies([]string{"127.0.0.1"})
	// 设置默认上传大小限制1gb（不设置的情况下默认是32gb）
	r.MaxMultipartMemory = 1 << 30

	initSwagger(r)
	initStaticRouter(r, webAssets)

	PublicGroup := r.Group(global.Config.RouterPrefix)
	PublicGroup.Use(middleware.JWTAuth())
	PrivateGroup := r.Group(global.Config.RouterPrefix)
	PrivateGroup.Use(middleware.JWTAuth()).Use(middleware.CasbinHandler())
	// 注册PublicGroup
	{

		RouterGroupApp.UserRouter.InitRouter(PublicGroup)
		RouterGroupApp.ServerRouter.InitRouter(PublicGroup)
		PublicGroup.GET("/health", func(c *gin.Context) {
			c.JSON(http.StatusOK, "ok")
		})
	}
	// 注册PrivateGroup
	{
		RouterGroupApp.FileListRouter.InitRouter(PrivateGroup)
		RouterGroupApp.VideoRouter.InitRouter(PrivateGroup)
		RouterGroupApp.AudioRouter.InitRouter(PrivateGroup)
	}
	l.Info("router register success")
	return r
}
