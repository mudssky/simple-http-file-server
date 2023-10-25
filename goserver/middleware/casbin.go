package middleware

import (
	"fmt"
	"io"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/mudssky/simple-http-file-server/goserver/global"
	"github.com/mudssky/simple-http-file-server/goserver/modal/response"
	"go.uber.org/zap"
)

// RABC 权限校验
func CasbinHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		l := global.Logger
		// keys是中间件上下文自带的一个map键值对，可以用来在中间件之间传递值
		// fmt.Println("keys", c.Keys)

		sub := c.GetString("username")
		// 移除api前缀，不然policy体积会大不少，写起来更麻烦
		obj := strings.TrimPrefix(c.Request.URL.Path, global.Config.RouterPrefix)
		act := c.Request.Method
		// fmt.Printf("sub:%v,obj:%v,act:%v\n", sub, obj, act)
		isPass, err := global.CasbinEnforcer.Enforce(sub, obj, act)
		l.Debug("permission check", zap.String("sub", sub),
			zap.String("obj", obj),
			zap.String("act", act),
			zap.Bool("isPass", isPass),
		)
		if err != nil {
			response.FailWithMessage("权限验证出错："+err.Error(), c)
			c.Abort()
			return
		}
		if !isPass {
			var bodyJson string
			if c.Request.Header.Get("Content-Type") == "application/json" {
				bodyBytes, err := io.ReadAll(c.Request.Body)
				if err != nil {
					l.Warn("read body error", zap.String("err", err.Error()))

				}
				bodyJson = string(bodyBytes)
			}

			l.Info("permission denied,request info:", zap.String("path", c.Request.URL.Path),
				zap.String("query", c.Request.URL.RawQuery),
				zap.String("body", bodyJson),
			)
			response.FailWithMessage("权限不足："+fmt.Sprintf("sub:%v,obj:%v,act:%v\n", sub, obj, act), c)
			c.Abort()
			return
		}
		c.Next()
	}
}
