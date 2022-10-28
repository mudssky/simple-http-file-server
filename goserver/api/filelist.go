package api

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/mudssky/simple-http-file-server/goserver/global"
	"github.com/mudssky/simple-http-file-server/goserver/modal/common/response"
	"go.uber.org/zap"
)

type FileListAPI struct{}

func (f *FileListAPI) GetFileList(c *gin.Context) {
	l := global.Logger
	// var path string
	pathParam := c.Query("path")
	l.Debug("测试参数",
		zap.String("path", pathParam),
	)
	if pathParam == "" {
		// 先判断文件路径列表是否有值,没有值返回错误
		if len(global.Config.FolderList) < 1 {
			response.FailWithMessage("没有设置文件路径", c)
			return
		}

		// l.Debug(global.Config.FolderList[0])
		// response.SuccessWithData()
		fmt.Println("配置:%v", global.Config.FolderList)
	}
	// if isPathExist, err := util.PathExists(pathParam); err != nil {

	// 	if isPathExist {
	// 	}
	// 	c.JSON(200, gin.H{
	// 		"message": "pong",
	// 	})
	// 	return
	// }
	// // path :=
	// l.Debug("path:" + path)
	// testpath := "D:\\Share"
}
