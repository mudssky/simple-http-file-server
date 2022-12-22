package middleware

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/mudssky/simple-http-file-server/goserver/global"
	"github.com/mudssky/simple-http-file-server/goserver/modal/response"
	"github.com/mudssky/simple-http-file-server/goserver/util"
)

func IPLimit() gin.HandlerFunc {
	return func(c *gin.Context) {
		l := global.Logger

		// 获取客户端ip
		clientIP := c.ClientIP()
		l.Info(fmt.Sprintf("ip %v enter", clientIP))
		// 本地地址默认是信任的。
		if clientIP != "127.0.0.1" {
			// 判断是否为局域网ip
			if util.IsLANIP(clientIP) {
				// 信任局域网，也就是内网的情况下，放行内网IP
				if global.Config.Security.TrustLan {
					c.Next()
					return
				}
				// else的情况则是检查白名单列表是否有匹配的，和非局域网ip逻辑一样。
			}
			// 判断白名单是否为空,白名单为空时拒绝所有非局域网ip
			if len(global.Config.Security.IPWhitelist) < 1 {
				response.FailWithMessage("不合法的ip:", c)
				c.Abort()
				return
			}
			// 白名单不为空时，继续判断白名单中是否有符合的,
			for _, whiteIP := range global.Config.Security.IPWhitelist {
				// 有符合的情况放行
				if whiteIP == clientIP {
					c.Next()
					return
				}
			}
			// 接下来是不符合的情况
			response.FailWithMessage("不合法的ip", c)
			fmt.Println("IP", c.ClientIP(), c.RemoteIP())
			c.Abort()
			return
		}
		c.Next()
	}
}
