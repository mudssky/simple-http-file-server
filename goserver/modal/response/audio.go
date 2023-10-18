package response

import (
	"encoding/base64"
	"os"

	"github.com/dhowden/tag"
	"github.com/mudssky/simple-http-file-server/goserver/global"
	"go.uber.org/zap"
)

// 全局变量在init函数里加载了，所以不会出现空指针问题。
var l *zap.Logger = global.Logger

type AudioMetadata struct {
	FileType    string                 `json:"fileType"`    //文件类型
	Format      string                 `json:"format"`      //标签格式
	Title       string                 `json:"title"`       //标题
	Album       string                 `json:"album"`       //专辑
	Artist      string                 `json:"artist"`      //艺术家
	AlbumArtist string                 `json:"albumArtist"` //专辑艺术家
	Composer    string                 `json:"composer"`    //作曲
	Genre       string                 `json:"genre"`       //分类
	Year        int                    `json:"year"`        //年代
	TrackNum    int                    `json:"track"`       //音轨数
	TrackTotal  int                    `json:"trackTotal"`  //音轨总数
	DiscNum     int                    `json:"discNum"`     //disc数
	DiscTotal   int                    `json:"discTotal"`   //disc总数
	Cover       string                 `json:"cover"`       //封面 base64
	Lyrics      string                 `json:"lyrics"`      //歌词
	Comment     string                 `json:"comment"`     //评论
	Raw         map[string]interface{} `json:"raw"`         //原始标签数据
}

type AudioInfo struct {
	FileInfo
	AudioMetadata
}

func AudioMetaData(pathName string) (res AudioMetadata, err error) {
	file, err := os.Open(pathName)
	if err != nil {
		l.Debug("open audio file error", zap.Error(err))
		return
	}
	audioMeta, err := tag.ReadFrom(file)
	if err != nil {
		// return nil, err
		return
	}
	trackNum, trackTotal := audioMeta.Track()
	diskNum, diskTotal := audioMeta.Disc()
	var coverBase64 string
	tagPic := audioMeta.Picture()
	if len(tagPic.Data) > (10<<20) || len(tagPic.Data) == 0 {
		coverBase64 = ""
	} else {
		coverBase64 = base64.RawStdEncoding.EncodeToString(tagPic.Data)
	}
	return AudioMetadata{
		Format:      string(audioMeta.Format()),
		FileType:    string(audioMeta.FileType()),
		Title:       audioMeta.Title(),
		Album:       audioMeta.Album(),
		Artist:      audioMeta.Artist(),
		AlbumArtist: audioMeta.AlbumArtist(),
		Composer:    audioMeta.Composer(),
		Genre:       audioMeta.Genre(),
		Year:        audioMeta.Year(),
		TrackNum:    trackNum,
		TrackTotal:  trackTotal,
		DiscNum:     diskNum,
		DiscTotal:   diskTotal,
		Cover:       coverBase64,
		Lyrics:      audioMeta.Lyrics(),
		Comment:     audioMeta.Comment(),
		Raw:         audioMeta.Raw(),
	}, nil
}
