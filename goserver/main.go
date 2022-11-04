package main

import (
	"fmt"

	_ "github.com/mudssky/simple-http-file-server/goserver/docs"
	"github.com/mudssky/simple-http-file-server/goserver/global"
	"github.com/mudssky/simple-http-file-server/goserver/router"
	"github.com/mudssky/simple-http-file-server/goserver/util"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

// @title           Swagger Example API
// @version         1.0
// @description     This is a sample server celler server.
// @termsOfService  http://swagger.io/terms/

// @contact.name   API Support
// @contact.url    http://www.swagger.io/support
// @contact.email  support@swagger.io

// @license.name  Apache 2.0
// @license.url   http://www.apache.org/licenses/LICENSE-2.0.html

// @host      127.0.0.1:7888
// @BasePath  /

// @securityDefinitions.basic  BasicAuth
func main() {
	// cmd.Execute()
	var r = router.InitRouter()
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	fmt.Printf(`
	默认自动化文档地址:http://127.0.0.1:%v/swagger/index.html
`, global.Config.Port)
	r.Run(":" + util.Itoa(global.Config.Port)) // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")

}
