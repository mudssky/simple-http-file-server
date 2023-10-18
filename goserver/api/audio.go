package api

import (
	"encoding/base64"
	"errors"
	"os"
	"path"
	"regexp"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/mudssky/simple-http-file-server/goserver/global"
	"github.com/mudssky/simple-http-file-server/goserver/modal/request"
	"github.com/mudssky/simple-http-file-server/goserver/modal/response"
)

type AudioApi struct{}

// var l = global.Logger

// 用于从文件名判断是否音频类文件
func IsAudio(fileName string) bool {
	pattern := regexp.MustCompile(`(?i)[\S\s]+\.(m4a|mp3|opus|mka|aac|flac)$`)
	return pattern.Match([]byte(fileName))
}
func (a *AudioApi) ReadDir(pathname string) (audioInfoList []response.AudioInfo, err error) {
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

	for _, dirEntry := range dirEntryList {
		if dirEntry.IsDir() || !IsAudio(dirEntry.Name()) {
			// 不是音频文件跳过
			continue
		}
		fileinfo, err := dirEntry.Info()
		if err != nil {
			return nil, err
		}
		itemPath := path.Join(pathname, fileinfo.Name())
		staticPath := strings.TrimPrefix(itemPath, rootPath)
		rootPathEncode := base64.RawURLEncoding.EncodeToString([]byte(rootPath))

		audioMetaData, err := response.AudioMetaData(itemPath)
		if err != nil {
			return nil, errors.New("获取音频信息出错:" + err.Error())
		}
		audioInfoList = append(audioInfoList, response.AudioInfo{
			FileInfo: response.FileInfo{
				Name:           fileinfo.Name(),
				LastModTime:    fileinfo.ModTime().UnixMilli(),
				Path:           itemPath,
				IsFolder:       fileinfo.IsDir(),
				Size:           fileinfo.Size(),
				RootPath:       rootPath,
				RootPathEncode: rootPathEncode,
				Link:           "/static/" + rootPathEncode + staticPath,
			},
			AudioMetadata: audioMetaData,
		})
	}
	return audioInfoList, nil
}

// AudioList
//
//	@Summary		获取当前目录的音频信息列表
//	@Description	获取当前目录的音频信息列表，封面图片如果有会转为base64
//	@Tags			audio
//	@Accept			application/json
//	@Produce		application/json
//	@Success		200	{object}	response.Response{data=[]response.AudioInfo}	"操作成功"
//	@Router			/audioList [post]
func (a *AudioApi) AudioList(c *gin.Context) {
	var req request.AudioListReq
	err := c.ShouldBindJSON(&req)
	if err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	audioList, err := a.ReadDir(req.Path)
	if err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	response.SuccessWithData(audioList, c)
}

// AudioInfo
//
//	@Summary		获取指定文件的音频信息
//	@Description	获取指定文件的音频信息，图片会被转为base64，大于10mb则不进行转换，避免传输数据包过大
//	@Tags			audio
//	@Accept			application/json
//	@Produce		application/json
//	@Param			data	body		request.AudioListReq						true	"音频文件定位信息"
//	@Success		200		{object}	response.Response{data=response.AudioInfo}	"操作成功"
//	@Router			/audioInfo [post]
//
//	@Security		ApiKeyAuth
func (a *AudioApi) AudioInfo(c *gin.Context) {
	var req request.AudioListReq
	err := c.ShouldBindJSON(&req)
	if err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	audioInfo, err := a.Info(req.Path)
	if err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	response.SuccessWithData(audioInfo, c)
}

func (a *AudioApi) Info(pathname string) (audioInfo response.AudioInfo, err error) {
	var rootPath string
	// 配置文件里面的folderlist就是根路径，通过对比路径前缀，判断是哪个根路径
	for _, folder := range global.Config.FolderList {
		if strings.HasPrefix(pathname, folder) {
			rootPath = folder
		}
	}
	file, err := os.Open(pathname)
	if err != nil {
		return
	}
	fileInfo, err := file.Stat()
	if err != nil {
		return
	}
	if fileInfo.IsDir() || !IsAudio(fileInfo.Name()) {
		// 不是音频文件跳过
		return audioInfo, errors.New("目录或者不是音频文件")
	}

	itemPath := path.Join(pathname, fileInfo.Name())
	staticPath := strings.TrimPrefix(itemPath, rootPath)
	rootPathEncode := base64.RawURLEncoding.EncodeToString([]byte(rootPath))

	audioMetaData, err := response.AudioMetaData(pathname)
	if err != nil {
		return audioInfo, errors.New("获取音频信息出错:" + err.Error())
	}
	audioInfo = response.AudioInfo{
		FileInfo: response.FileInfo{
			Name:           fileInfo.Name(),
			LastModTime:    fileInfo.ModTime().UnixMilli(),
			Path:           itemPath,
			IsFolder:       fileInfo.IsDir(),
			Size:           fileInfo.Size(),
			RootPath:       rootPath,
			RootPathEncode: rootPathEncode,
			Link:           "/static/" + rootPathEncode + staticPath,
		},
		AudioMetadata: audioMetaData,
	}

	return audioInfo, nil
}

// PlayAudio
//
//	@Summary	播放音频，通过ffmpeg转换音频流
//	@Description
//	@Tags		audio
//	@Accept		application/json
//	@Produce	application/json
//	@Success	200	{object}	response.Response{data=response.AudioInfo}	"操作成功"
//	@Router		/playAudio [post]
func (a *AudioApi) PlayAudio(c *gin.Context) {
	var req request.AudioListReq
	err := c.ShouldBindJSON(&req)
	if err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	audioInfo, err := a.Info(req.Path)
	if err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	response.SuccessWithData(audioInfo, c)
}
