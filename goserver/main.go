package main

import (
	"embed"
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/mdp/qrterminal"
	_ "github.com/mudssky/simple-http-file-server/goserver/docs"
	"github.com/mudssky/simple-http-file-server/goserver/global"
	"github.com/mudssky/simple-http-file-server/goserver/internal/server"
	"github.com/mudssky/simple-http-file-server/goserver/modal/response"
	"github.com/mudssky/simple-http-file-server/goserver/router"
	"github.com/mudssky/simple-http-file-server/goserver/util"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

//go:embed  public/*
var webAssets embed.FS

func locateFileSystem(dir string) http.FileSystem {
	fsys, err := fs.Sub(webAssets, dir)
	if err != nil {
		panic(err)
	}
	return http.FS(fsys)
}

//go:generate go env -w GO111MODULE=on
//go:generate go env -w GOPROXY=https://goproxy.cn,direct
//go:generate go mod tidy
//go:generate go mod download

//	@title			Swagger Example API
//	@version		1.0
//	@description	This is a sample server.
//	@termsOfService	http://swagger.io/terms/

//	@contact.name	API Support
//	@contact.url	http://www.swagger.io/support
//	@contact.email	support@swagger.io

//	@license.name	Apache 2.0
//	@license.url	http://www.apache.org/licenses/LICENSE-2.0.html

//	@host		127.0.0.1:7888
//	@BasePath	/api

//	@securityDefinitions.apikey	ApiKeyAuth
//	@in							header
//	@name						x-token

// @externalDocs.description	OpenAPI
// @externalDocs.url			https://swagger.io/resources/open-api/
func main() {

	// 模式设置,按照env,配置文件的顺序读取模式
	gin.SetMode(global.Config.Mode)
	var r = router.InitRouter()
	// 发布版本不显示文档
	if global.Config.Mode != "release" {
		// 文档路由
		r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	}

	// html和静态文件路由
	r.StaticFS("/assets/", locateFileSystem("public/assets"))
	r.GET("/", func(c *gin.Context) {
		htmlByte, err := webAssets.ReadFile("public/index.html")
		if err != nil {
			response.FailWithMessage(err.Error(), c)
		}
		c.Data(http.StatusOK, "text/html; charset=utf-8", htmlByte)
	})
	fmt.Print(`
	ghs 文件服务器
	`)
	fmt.Printf(`localhost:http://127.0.0.1:%v`, global.Config.Port)
	Ips, err := util.ClientIPs()
	if err != nil {
		global.Logger.Warn(err.Error())
	}
	for index, ip := range Ips {
		fmt.Printf(`
	NetWork%v:http://%v:%v`, index+1, ip, global.Config.Port)
	}
	fmt.Println()

	localUrl := fmt.Sprintf("http://%v:%v\n", Ips[0], global.Config.Port)
	qrterminal.Generate(localUrl, qrterminal.L, os.Stdout)
	if global.Config.Mode != "release" {
		fmt.Printf(`
	默认自动化文档地址:http://127.0.0.1:%v/swagger/index.html
`, global.Config.Port)
	}

	srv := &http.Server{
		Addr:    ":" + util.Itoa(global.Config.Port),
		Handler: r,
	}
	go func() {
		// 服务连接
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen: %s\n", err)
		}
	}()
	// 优雅关机代码,发送 syscall.SIGHUP 信号实现,也就是ctrl+C关闭
	// 但是watchexec目前不支持这个信号。
	server.GracefullyShutdown(srv)
}
