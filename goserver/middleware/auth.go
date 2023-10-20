package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/mudssky/simple-http-file-server/goserver/global"
	"github.com/mudssky/simple-http-file-server/goserver/modal/response"
	"github.com/mudssky/simple-http-file-server/goserver/util"
	"go.uber.org/zap"
)

func JWTAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		l := global.Logger
		token := c.Request.Header.Get("X-Token")

		c.Set("token", token)

		l.Debug("jwt auth enter", zap.String("token", token), zap.Any("header", c.Request.Header))
		if token == "" {

			c.Set("username", "visitor")
			// token为空的情况下，按游客来计算，根据casbin里面visitor的权限来决定是否能访问
			c.Next()
			// c.JSON(http.StatusUnauthorized, response.Response{
			// 	Code: 1,
			// 	Msg:  "未登录或非法访问",
			// })
			// c.Abort()
			return
		}
		jwtS := util.NewJWT(global.Config.JWT.Secret)
		claims, err := jwtS.ParseToken(token)
		l.Debug("jwt auth parse",
			zap.Any("claims", claims),
		)
		if err != nil {
			c.JSON(http.StatusUnauthorized, response.Response{
				Code: 1,
				Msg:  err.Error(),
			})
			c.Abort()
		}

		c.Set("username", claims.Username)
		c.Next()
	}
}
