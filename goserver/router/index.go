package router

import (
	"net/http"
	"path"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/mudssky/simple-http-file-server/goserver/api"
	"github.com/mudssky/simple-http-file-server/goserver/global"
	"github.com/mudssky/simple-http-file-server/goserver/middleware"
)

func InitRouter() *gin.Engine {
	l := global.Logger
	var r = gin.New()

	r.LoadHTMLFiles("oublic")
	r.Use(middleware.ZapLogger(), middleware.ZapRecovery(true))
	// r := gin.Default()
	r.Use(middleware.Cors())
	// 设置默认上传大小限制1gb（不设置的情况下默认是32gb）
	r.MaxMultipartMemory = 1 << 30

	// 遍历生成静态文件目录
	for _, folderpath := range global.Config.FolderList {
		l.Debug("static path: /static/" + path.Base(folderpath))
		r.StaticFS("/static/"+path.Base(folderpath), http.Dir(folderpath))
	}

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})

	})
	r.GET("/testshutdown", func(ctx *gin.Context) {
		time.Sleep(5 * time.Second)
		ctx.String(http.StatusOK, "gin %s", "ok")
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

		apiGroup.POST("/uploadMulti", fileListAPI.UploadMulti)
		apiGroup.POST("/renameItem", fileListAPI.RenameItem)
		apiGroup.POST("/downloadItem", fileListAPI.DownloadItem)
		// r.POST("/uploadSingle", fileListAPI.UploadSingle)

		serverApi := api.ApiGroupApp.ServerAPI
		apiGroup.GET("/getServerInfo", serverApi.GetServerInfo)
	}

	return r

}
