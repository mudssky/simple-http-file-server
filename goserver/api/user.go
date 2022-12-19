package api

import (
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"github.com/mudssky/simple-http-file-server/goserver/config"
	"github.com/mudssky/simple-http-file-server/goserver/global"
	"github.com/mudssky/simple-http-file-server/goserver/modal/request"
	"github.com/mudssky/simple-http-file-server/goserver/modal/response"
	"golang.org/x/crypto/bcrypt"
)

type UserAPI struct{}

// Login
// @Summary      登录
// @Description  登录
// @Tags         server
// @Accept       application/json
// @Produce      application/json
// @Success      200  {object}  response.Response{data=any} "操作成功"
// @Router       /login [post]
func (u *UserAPI) Login(c *gin.Context) {
	l := global.Logger
	// ip, err := util.GetClientIp()
	var req request.LoginReq
	err := c.ShouldBindJSON(&req)
	if err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	fmt.Println("login enter")
	if len(global.Config.UserList) < 1 {
		response.FailWithMessage("未配置用户列表，请先在配置文件中配置用户", c)
		l.Error("登录失败，用户列表未配置")
		return
	}
	for _, user := range global.Config.UserList {
		if user.Username == req.Username {
			if err := bcrypt.CompareHashAndPassword([]byte(req.Password), []byte(user.Password)); err != nil {
				response.FailWithMessage("登录失败,用户名或密码错误", c)
			}
			token, err := global.Config.Jwt.GenJwtToken(config.CustomClaims{
				Username:       req.Username,
				StandardClaims: jwt.StandardClaims{ExpiresAt: time.Now().Add(time.Second * time.Duration(global.Config.Jwt.Expires)).Unix()},
			})
			if err != nil {
				response.FailWithMessage("token生成失败："+err.Error(), c)
				return
			}
			response.SuccessWithDetailed(response.LoginRes{
				Token: token,
				UserInfo: response.UserInfo{
					Username: req.Username,
				},
			}, "登陆成功", c)
			return
		}
	}
	response.FailWithMessage("登录失败,用户名或密码错误", c)
}
