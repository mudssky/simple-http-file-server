package api

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/mudssky/simple-http-file-server/goserver/global"
	"github.com/mudssky/simple-http-file-server/goserver/modal/request"
	"github.com/mudssky/simple-http-file-server/goserver/modal/response"
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
		if user.Username == req.Username && user.Password == req.Password {
			fmt.Println("登陆成功")
			response.SuccessWithMessage("登陆成功", c)
			return
		}
	}
	response.FailWithMessage("登录失败", c)
}
