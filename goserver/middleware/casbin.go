package middleware

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/mudssky/simple-http-file-server/goserver/global"
	"github.com/mudssky/simple-http-file-server/goserver/modal/response"
	"github.com/mudssky/simple-http-file-server/goserver/util"
)

// RABC 权限校验
func CasbinHandler() gin.HandlerFunc {
	return func(c *gin.Context) {

		token := c.Request.Header.Get("x-token")
		if token == "" {
			// 没有传token的情况为游客
			sub := "visitor"
			obj := c.Request.URL.Path
			act := c.Request.Method
			fmt.Printf("sub:%v,obj:%v,act:%v\n", sub, obj, act)

			isPass, err := global.CasbinEnforcer.Enforce(sub, obj, act)
			if err != nil {
				response.FailWithMessage("权限验证出错："+err.Error(), c)
				c.Abort()
				return
			}
			if !isPass {
				response.FailWithMessage("权限不足", c)
				c.Abort()
				return
			}
		} else {
			jwtS := util.NewJWT(global.Config.Jwt.Secret)
			claims, _ := jwtS.ParseToken(token)
			sub := claims.Username
			obj := c.Request.URL.Path
			act := c.Request.Method
			fmt.Printf("sub:%v,obj:%v,act:%v\n", sub, obj, act)
			isPass, err := global.CasbinEnforcer.Enforce(sub, obj, act)
			if err != nil {
				response.FailWithMessage("权限验证出错："+err.Error(), c)
				c.Abort()
				return
			}
			if !isPass {
				response.FailWithMessage("权限不足", c)
				c.Abort()
				return
			}
		}
		c.Next()
	}
}
