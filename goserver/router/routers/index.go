package routers

import (
	"github.com/gin-gonic/gin"
	"github.com/mudssky/simple-http-file-server/goserver/router/routers/audioRouter"
	"github.com/mudssky/simple-http-file-server/goserver/router/routers/fileListRouter"
	"github.com/mudssky/simple-http-file-server/goserver/router/routers/serverRouter"
	"github.com/mudssky/simple-http-file-server/goserver/router/routers/userRouter"
	"github.com/mudssky/simple-http-file-server/goserver/router/routers/videoRouter"
)

type CustomRouter interface {
	InitRouter(Router *gin.RouterGroup)
}
type RouterGroup struct {
	FileListRouter fileListRouter.Router
	UserRouter     userRouter.Router
	ServerRouter   serverRouter.Router
	VideoRouter    videoRouter.Router
	AudioRouter    audioRouter.Router
}

var RouterGroupApp = new(RouterGroup)

// 通过反射注册所有的Router
// func InstallRouters(group *gin.RouterGroup) {
// 	routerValue := reflect.ValueOf(RouterGroupApp).Elem()
// 	for i := 0; i < routerValue.NumField(); i++ {
// 		field := routerValue.Field(i)
// 		// 因为InitRouter接收器是指针，所以这里用Addr转一下
// 		initRouterMethod := field.Addr().MethodByName("InitRouter")
// 		// 如果找到InitRouter，那么就调用
// 		if initRouterMethod.IsValid() {
// 			initRouterMethod.Call([]reflect.Value{reflect.ValueOf(group)})
// 		}
// 	}
// }
