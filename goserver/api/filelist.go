package api

import (
	"fmt"
	"path"

	"os"

	"github.com/gin-gonic/gin"
	myerror "github.com/mudssky/simple-http-file-server/goserver/error"
	"github.com/mudssky/simple-http-file-server/goserver/global"
	"github.com/mudssky/simple-http-file-server/goserver/modal/request"
	"github.com/mudssky/simple-http-file-server/goserver/modal/response"
	"github.com/mudssky/simple-http-file-server/goserver/util"
	"github.com/samber/lo"
)

type FileListAPI struct{}

func (f *FileListAPI) ReadDir(pathname string) (fileinfoList []response.FileInfo, err error) {
	dirEntryList, err := os.ReadDir(pathname)
	if err != nil {
		return nil, err
	}
	reslist := []response.FileInfo{}
	for _, dirEntry := range dirEntryList {
		fileinfo, err := dirEntry.Info()
		if err != nil {
			return nil, err
		}
		reslist = append(reslist, response.FileInfo{
			Name:        fileinfo.Name(),
			LastModTime: fileinfo.ModTime().UnixMilli(),
			Path:        path.Join(pathname, fileinfo.Name()),
			IsFolder:    fileinfo.IsDir(),
			Size:        fileinfo.Size(),
		})
	}
	return reslist, nil

}

// GetFileList
// @Summary      传入文件夹路径获取文件列表，不传参时返回根列表
// @Description  传入路径获取文件列表，不传参时返回根列表
// @Tags         filelist
// @Accept       application/json
// @Produce      application/json
// @Param        data   body  request.FileListReq  false "文件列表路径"
// @Success      200  {object}  response.Response{data=[]response.FileInfo} "文件列表信息"
// @Router       /filelist [post]
func (f *FileListAPI) GetFileList(c *gin.Context) {
	l := global.Logger
	var req request.FileListReq
	err := c.ShouldBindJSON(&req)
	if err != nil {
		response.FailWithMessage(myerror.JsonParseError, c)
		return
	}
	if req.Path == "" {
		// 获取不到路径的情况，采用程序配置的路径
		if len(global.Config.FolderList) < 1 {
			response.FailWithMessage("没有设置文件路径", c)
			return
		}
		l.Debug(fmt.Sprintf("global config : %v", global.Config.FolderList))
		response.SuccessWithData(lo.Map(global.Config.FolderList, func(item string, index int) response.FileInfo {
			return response.FileInfo{
				Path:     item,
				IsFolder: true,
				Name:     path.Base(item),
			}
		}), c)
		return
	} else {
		l.Debug("查找文件路径")
		isExist, err := util.PathExists(req.Path)
		if err != nil {
			errmsg := fmt.Sprintf("检测文件是否存在时报错：%v", err)
			l.Warn(errmsg)
			response.FailWithMessage(errmsg, c)
			return
		}
		// l.Debug("文件路径是否存在", zap.Bool("is exist", isExist))
		// 文件路径不存在时
		if !isExist {
			response.FailWithMessage("文件不存在", c)
			return
		}

		filestat, err := os.Stat(req.Path)
		if err != nil {
			response.FailWithMessage(fmt.Sprintf("获取文件状态出错%v", err), c)
			return
		}
		// 是文件夹的情况获取文件夹列表
		if filestat.IsDir() {
			reslist, err := f.ReadDir(req.Path)
			// dirEntryList, err := os.ReadDir(req.Path)
			if err != nil {
				response.FailWithMessage(fmt.Sprintf("读取文件列表失败%v", err), c)
				return
			}
			response.SuccessWithData(reslist, c)
			// fmt.Printf("f : %+v\n", dirEntryList)
		} else {
			response.FailWithMessage("不支持文件路径", c)
		}

	}
}

// MakeDir
// @Summary      新建文件夹
// @Description  传入当前所在路径和文件夹的名字，新建文件夹
// @Tags         filelist
// @Accept       application/json
// @Produce      application/json
// @Param        data   body  request.NewFolderReq false "目录信息"
// @Success      200  {object}  any "返回列表成功"
// @Router       /mkdir [post]
func (f *FileListAPI) MakeDir(c *gin.Context) {
	// l := global.Logger
	var req request.NewFolderReq
	err := c.ShouldBindJSON(&req)
	if err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	// fmt.Println("req:", req)
	if req.FolderPath == "" {
		response.FailWithMessage("路径不能为空", c)
		return
	}
	// 检测路径是否已经存在
	// if isNewfolderExist,err:=util.PathExists(req.FolderPath); isNewfolderExist|| err!=nil{
	// 	response.FailWithMessage("不合法的路径", c)
	// 	return
	// }
	if err := os.Mkdir(req.FolderPath, os.ModeDir); err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	response.Success(c)

}
