package api

import (
	"github.com/gin-gonic/gin"
	"github.com/mudssky/simple-http-file-server/goserver/global"
	"github.com/mudssky/simple-http-file-server/goserver/modal/response"
	"github.com/mudssky/simple-http-file-server/goserver/util"
)

type ServerAPI struct{}

// GetServerInfo
// @Summary      获取服务器信息
// @Description  获取本地ip等服务器信息
// @Tags         server
// @Accept       application/json
// @Produce      application/json
// @Success      200  {object}  response.Response{data=response.ServerInfoRes} "操作成功"
// @Router       /getServerInfo [get]
func (s *ServerAPI) GetServerInfo(c *gin.Context) {
	// l := global.Logger
	// ip, err := util.GetClientIp()
	IPList, err := util.ServerIPs()

	if err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	// outIP, _ := util.ExternalIP()
	// fmt.Println("outip", outIP)
	response.SuccessWithData(response.ServerInfoRes{
		LocalIPList: IPList,
		Port:        int(global.Config.Port),
	}, c)

}
