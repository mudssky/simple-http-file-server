package subtitle

import (
	"bytes"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/asticode/go-astisub"
	"github.com/mudssky/simple-http-file-server/goserver/util/arrayutil"
)

type Subtitle struct{}

func ConvertToVtt(pathname string) (vtt string, err error) {
	ext := filepath.Ext(pathname)
	supportExt := []string{".ass", ".srt", ".vtt"}
	lowerExt := strings.ToLower(ext)
	if arrayutil.Include(supportExt, lowerExt) {
		if ext == ".vtt" {
			vttBytes, err := os.ReadFile(pathname)
			if err != nil {
				return "", err
			}
			vtt = string(vttBytes)
		} else {
			sub, err := astisub.OpenFile(pathname)
			if err != nil {
				return "", err
			}
			var buf = &bytes.Buffer{}
			sub.WriteToWebVTT(buf)
			vtt = buf.String()
		}

	} else {
		err = fmt.Errorf("unsupported format: %s", ext)
	}
	return
}
