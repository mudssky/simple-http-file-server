package middleware

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/mudssky/simple-http-file-server/goserver/global"
	"github.com/mudssky/simple-http-file-server/goserver/modal/response"
)

// RABC 权限校验
func CasbinHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		// keys是中间件上下文自带的一个map键值对，可以用来在中间件之间传递值
		// fmt.Println("keys", c.Keys)
		sub := c.GetString("username")
		obj := c.Request.URL.Path
		act := c.Request.Method
		// fmt.Printf("sub:%v,obj:%v,act:%v\n", sub, obj, act)
		isPass, err := global.CasbinEnforcer.Enforce(sub, obj, act)
		if err != nil {
			response.FailWithMessage("权限验证出错："+err.Error(), c)
			c.Abort()
			return
		}
		if !isPass {
			response.FailWithMessage("权限不足："+fmt.Sprintf("sub:%v,obj:%v,act:%v\n", sub, obj, act), c)
			c.Abort()
			return
		}

		c.Next()
	}
}
