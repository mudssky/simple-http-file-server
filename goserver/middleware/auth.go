package middleware

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/mudssky/simple-http-file-server/goserver/global"
	"github.com/mudssky/simple-http-file-server/goserver/modal/response"
	"github.com/mudssky/simple-http-file-server/goserver/util"
)

func JWTAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.Request.Header.Get("x-token")
		if token == "" {
			c.JSON(http.StatusUnauthorized, response.Response{
				Code: 1,
				Msg:  "未登录或非法访问",
			})
			c.Abort()
		}
		jwtS := util.NewJWT(global.Config.Jwt.Secret)
		claims, err := jwtS.ParseToken(token)
		fmt.Println("token: ", token)
		fmt.Println("claims: ", claims)
		if err != nil {
			c.JSON(http.StatusUnauthorized, response.Response{
				Code: 1,
				Msg:  err.Error(),
			})
			c.Abort()
		}
		// ParseToken()
	}
}
