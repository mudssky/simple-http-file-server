package api

import (
	"encoding/base64"
	"errors"
	"fmt"
	"io/fs"
	"net/url"
	"os"
	"path"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/mudssky/goutils"
	myerror "github.com/mudssky/simple-http-file-server/goserver/error"
	"github.com/mudssky/simple-http-file-server/goserver/global"
	"github.com/mudssky/simple-http-file-server/goserver/modal/request"
	"github.com/mudssky/simple-http-file-server/goserver/modal/response"
	"github.com/mudssky/simple-http-file-server/goserver/util"

	"go.uber.org/zap"
)

type FileListAPI struct{}

//	func getStaticLink(pathname string, isDir bool) string {
//		if isDir {
//			return ""
//		}
//		for _, rootpath := range global.Config.FolderList {
//			rootname := path.Base(rootpath)
//			if strings.HasPrefix(pathname, rootpath) {
//				return "/" + rootname + "/" + pathname[len(rootpath)+1:]
//			}
//		}
//		return ""
//	}
func (f *FileListAPI) ReadDir(pathname string) (fileinfoList []response.FileInfo, err error) {
	var rootPath string
	// 配置文件里面的folderlist就是根路径，通过对比路径前缀，判断是哪个根路径
	for _, folder := range global.Config.FolderList {
		if strings.HasPrefix(pathname, folder) {
			rootPath = folder
		}
	}
	dirEntryList, err := os.ReadDir(pathname)
	if err != nil {
		return nil, err
	}
	resList := []response.FileInfo{}
	for _, dirEntry := range dirEntryList {
		fileinfo, err := dirEntry.Info()
		if err != nil {
			return nil, err
		}
		itemPath := path.Join(pathname, fileinfo.Name())
		staticPath := strings.TrimPrefix(itemPath, rootPath)
		rootPathEncode := base64.RawURLEncoding.EncodeToString([]byte(rootPath))
		resList = append(resList, response.FileInfo{
			Name:           fileinfo.Name(),
			LastModTime:    fileinfo.ModTime().UnixMilli(),
			Path:           itemPath,
			IsFolder:       fileinfo.IsDir(),
			Size:           fileinfo.Size(),
			RootPath:       rootPath,
			RootPathEncode: rootPathEncode,
			Link:           "/static/" + rootPathEncode + staticPath,
		})
	}
	return resList, nil
}

// GetFileList
//
//	@Summary		传入文件夹路径获取文件列表，不传参时返回根列表
//	@Description	传入路径获取文件列表，不传参时返回根列表
//	@Tags			filelist
//	@Accept			application/json
//	@Produce		application/json
//	@Param			data	body		request.FilePath							true	"文件列表路径"
//	@Success		200		{object}	response.Response{data=[]response.FileInfo}	"文件列表信息"
//	@Router			/fileList/filelist [post]
func (f *FileListAPI) GetFileList(c *gin.Context) {
	l := global.Logger
	var req request.FilePath
	err := c.ShouldBindJSON(&req)
	if err != nil {
		l.Warn(fmt.Sprintf("参数解析错误：%v", req))
		response.FailWithMessage(err.Error(), c)
		return
	}
	if req.Path == "" {
		// 获取不到路径的情况，采用程序配置的路径
		if len(global.Config.FolderList) < 1 {
			response.FailWithMessage("没有设置文件路径", c)
			return
		}
		l.Debug(fmt.Sprintf("global config : %v", global.Config.FolderList))
		response.SuccessWithData(goutils.Map(global.Config.FolderList, func(item string, index int) response.FileInfo {
			return response.FileInfo{
				Path:           item,
				IsFolder:       true,
				Name:           path.Base(item),
				RootPath:       item,
				RootPathEncode: base64.RawURLEncoding.EncodeToString([]byte(item)),
				// Link:           "",
			}
		}), c)
		return
	} else {
		fileStat, err := os.Stat(req.Path)
		if err != nil {
			response.FailWithMessage(fmt.Sprintf("获取文件状态出错%v", err), c)
			return
		}
		// 是文件夹的情况获取文件夹列表
		if fileStat.IsDir() {
			resList, err := f.ReadDir(req.Path)
			// dirEntryList, err := os.ReadDir(req.Path)
			if err != nil {
				response.FailWithMessage(fmt.Sprintf("读取文件列表失败%v", err), c)
				return
			}
			response.SuccessWithData(resList, c)
			// fmt.Printf("f : %+v\n", dirEntryList)
		} else {
			response.FailWithMessage("不支持文件路径", c)
		}

	}
}

// MakeDir
//
//	@Summary		新建文件夹
//	@Description	传入文件夹的路径，新建文件夹
//	@Tags			filelist
//	@Accept			application/json
//	@Produce		application/json
//	@Param			data	body		request.MkdirPath			true	"目录信息"
//	@Success		200		{object}	response.Response{data=any}	"操作成功"
//	@Router			/fileList/mkdir [post]
func (f *FileListAPI) MakeDir(c *gin.Context) {
	// l := global.Logger
	var req request.MkdirPath
	err := c.ShouldBindJSON(&req)
	if err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	// 检测路径是否已经存在
	// if isNewfolderExist,err:=util.PathExists(req.FolderPath); isNewfolderExist|| err!=nil{
	// 	response.FailWithMessage("不合法的路径", c)
	// 	return
	// }
	if err := os.Mkdir(req.Path, os.ModeDir); err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	response.Success(c)

}

// removeItem
//
//	@Summary		删除目录或文件
//	@Description	传入路径，删除目录或文件
//	@Tags			filelist
//	@Accept			application/json
//	@Produce		application/json
//	@Param			data	body		request.OperateFilePath		true	"路径"
//	@Success		200		{object}	response.Response{data=any}	"操作成功"
//	@Router			/fileList/removeItem [post]
func (f *FileListAPI) RemoveItem(c *gin.Context) {
	// l := global.Logger
	var req request.OperateFilePath
	err := c.ShouldBindJSON(&req)
	if err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	if err := os.RemoveAll(req.Path); err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	response.Success(c)

}

// createTxt
//
//	@Summary		创建txt文本文件
//	@Description	传入文件名和内容，创建txt文本文件
//	@Tags			filelist
//	@Accept			application/json
//	@Produce		application/json
//	@Param			data	body		request.TxtFile				true	"创建txt需要的参数"
//	@Success		200		{object}	response.Response{data=any}	"操作成功"
//	@Router			/fileList/createTxt [post]
func (f *FileListAPI) CreateTxt(c *gin.Context) {
	// l := global.Logger
	var req request.TxtFile
	err := c.ShouldBindJSON(&req)
	if err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	if isExist, err := util.PathExists(req.Path); isExist || err != nil {
		if isExist {
			response.FailWithMessage("文件已存在", c)
			return
		}
		response.FailWithMessage(err.Error(), c)
		return

	}
	if err := os.WriteFile(req.Path, []byte(req.Content), fs.ModePerm); err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	response.Success(c)
}

// uploadMulti
//
//	@Summary		多文件上传
//	@Description	传入文件名和内容，创建txt文本文件
//	@Tags			filelist
//	@Accept			application/json
//	@Produce		application/json
//	@Param			data	body		request.TxtFile				true	"创建txt需要的参数"
//	@Success		200		{object}	response.Response{data=any}	"操作成功"
//	@Router			/fileList/uploadMulti [post]
func (f *FileListAPI) UploadMulti(c *gin.Context) {
	l := global.Logger
	fmt.Println("enter upload multi")
	// Multipart form
	form, err := c.MultipartForm()
	if err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	// fmt.Printf("%+v\n", form)
	// fmt.Printf("%+v\n", form.Value["path"])
	files := form.File["file"]
	uploadDir := form.Value["path"][0]
	l.Debug("上传参数", zap.String("uploadDir", uploadDir))
	isExist, err := util.PathExists(uploadDir)

	if err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	// 文件夹不存在时，手动创建
	if !isExist {
		l.Debug(fmt.Sprintln("创建文件夹:", uploadDir))
		err := os.MkdirAll(uploadDir, os.ModeDir)
		if err != nil {
			response.FailWithMessage(err.Error(), c)
			return
		}
	}

	for _, file := range files {
		newpath := path.Join(uploadDir, files[0].Filename)
		// 检查文件是否存在，已经存在的部分会中断上传
		isExist, err := util.PathExists(newpath)
		if err != nil {
			response.FailWithMessage(err.Error(), c)
			return
		}
		if isExist {
			response.FailWithMessage(myerror.FileAlreadyExistError, c)
			return
		}
		fmt.Println("newpath", newpath)

		// 上传文件至指定目录
		c.SaveUploadedFile(file, newpath)
	}
	// c.SaveUploadedFile(form.File["files"][0], "./ddd.png")
	// c.String(http.StatusOK, fmt.Sprintf("%d files uploaded!", len(files)))
}

// renameItem
//
//	@Summary		重命名文件或文件夹
//	@Description	传入文件名和路径，重命名文件或文件夹
//	@Tags			filelist
//	@Accept			application/json
//	@Produce		application/json
//	@Param			data	body		request.Rename				true	"重命名需要的参数"
//	@Success		200		{object}	response.Response{data=any}	"操作成功"
//	@Router			/fileList/renameItem [post]
func (f *FileListAPI) RenameItem(c *gin.Context) {
	var req request.Rename
	err := c.ShouldBindJSON(&req)
	if err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	if req.Path == "" || req.NewName == "" {
		response.FailWithMessage("新文件名或路径不能为空", c)
		return
	}
	dir, _ := path.Split(req.Path)

	if err := os.Rename(req.Path, path.Join(dir, req.NewName)); err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}

	response.Success(c)

}

type DownloadDirCheckOption struct {
	maxCount          int
	maxSize           int64
	ignorePatternList []string
}

func (f *FileListAPI) checkDirBeforeCompress(dir string, option DownloadDirCheckOption) error {
	count := 0
	var totalSize int64
	exploreOption := util.ExploreDirOption{
		RootPath:          dir,
		IgnorePatternList: option.ignorePatternList,
	}
	return util.ExploreDir(exploreOption, func(path string, d fs.DirEntry, err error) error {
		count += 1
		if !d.IsDir() {
			info, err := d.Info()
			if err != nil {
				return err
			}
			totalSize = totalSize + info.Size()
		}
		if count > option.maxCount {
			return fmt.Errorf("文件数目过多，超过%d个", option.maxCount)
		}
		if totalSize > option.maxSize {
			return errors.New("文件大小超过" + util.FileSizeFormatter(option.maxSize, 0))
		}
		return nil
	})

}

// downloadItem
//
//	@Summary		下载项目
//	@Description	传入fileitem下载指定项目，文件夹和文件的情况区别处理
//	@Tags			filelist
//	@Accept			application/json
//	@Produce		application/json
//	@Param			data	body		response.FileInfo			true	"下载文件对应的信息"
//	@Success		200		{object}	response.Response{data=any}	"操作成功"
//	@Router			/fileList/downloadItem [post]
func (f *FileListAPI) DownloadItem(c *gin.Context) {
	var req request.FileInfo
	// 这一步已经校验了路径存在
	err := c.ShouldBindJSON(&req)
	if err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	// 打包时忽略的文件
	ignorePatternList := []string{"[\\/]node_modules[\\/]|[\\/]node_modules$"}
	if req.IsFolder {
		err := f.checkDirBeforeCompress(req.Path, DownloadDirCheckOption{
			maxCount:          1000,
			maxSize:           4 << 30, //4gb
			ignorePatternList: ignorePatternList,
		})
		if err != nil {
			response.FailWithMessage(err.Error(), c)
			return
		}
		// c.Writer.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename*=utf-8''%s.zip", url.QueryEscape(req.Name)))
		c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=%s.zip", url.QueryEscape(req.Name)))
		// c.Header("Content-Disposition", "attachment; filename="+req.Name+".zip")
		err = util.ZipBytes(util.ZipOpt{
			SrcFile:           req.Path,
			IgnorePatternList: ignorePatternList,
			DestWriter:        c.Writer,
		})
		if err != nil {
			response.FailWithMessage(err.Error(), c)
			return
		}
	} else {
		// l := global.Logger
		// l.Debug("download file name", zap.String("filename", req.Name))
		// c.Header("Content-Type", "application/octet-stream")
		//
		contentStr := "attachment; filename*=UTF-8''" + url.QueryEscape(req.Name)

		c.Header("Content-tion", contentStr)
		// l.Debug("content-do", zap.String("cd", contentStr))
		// c.Header("Content-Transfer-Encoding", "binary")
		c.File(req.Path)
	}
	fmt.Println("req", req)

}
