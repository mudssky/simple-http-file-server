package api

import (
	"github.com/gin-gonic/gin"
	"github.com/mudssky/simple-http-file-server/goserver/modal/request"
	"github.com/mudssky/simple-http-file-server/goserver/modal/response"
	"github.com/mudssky/simple-http-file-server/goserver/util/subtitle"
)

type VideoAPI struct{}

// Login
//
//	@Summary		获取vtt字幕
//	@Description	将本地的ass，srt格式的字幕转成vtt返回字符串
//	@Tags			video
//	@Accept			application/json
//	@Produce		application/json
//	@Success		200	{object}	response.Response{data=string}	"操作成功"
//	@Router			/video/getVttSubtitle [get]
func (v *VideoAPI) GetVttSubtitle(c *gin.Context) {
	var req request.OperateFilePath
	err := c.ShouldBindJSON(&req)
	if err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	vtt, err := subtitle.ConvertToVtt(req.Path)
	if err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	response.SuccessWithData(response.VttSubtitleRes{
		VttSubtitle: vtt,
	}, c)
}
