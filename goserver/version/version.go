package version

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"runtime"
	"strings"

	goversion "github.com/hashicorp/go-version"
	"github.com/mudssky/simple-http-file-server/goserver/sysinfo"
)

var (
	latestVersionStr string
	downloadPrefix   string
)

func Version() string {
	return "0.0.9"
}

func PrintVersion() {
	version := Version()
	fmt.Printf("ghs: version %s\n", version)
}

// 获取最新版本
func LatestVersion() string {
	latestURL := "https://github.com/mudssky/simple-http-file-server/releases/latest"
	resp, err := http.Get(latestURL)
	if err != nil {
		log.Fatalln("get update url failed:", err)
	}
	return GithubReleaseVersion(resp.Request.URL.String())
}

// 检查是否需要更新
func CheckUpdate() (needUpdate bool, err error) {
	currentVersion, err := goversion.NewSemver(Version())
	if err != nil {
		log.Fatalln("new version error", currentVersion, err.Error())
	}
	latestVersionStr = LatestVersion()
	latestVersion, err := goversion.NewSemver(latestVersionStr)
	if err != nil {
		log.Fatalln("new version error", latestVersion, err.Error())
	}
	fmt.Println("os:", os.Environ())
	fmt.Println("runtime", runtime.GOOS, runtime.GOARCH)
	// 版本不需要更新的情况
	if currentVersion.LessThan(latestVersion) {
		return true, nil
	}
	return false, nil
}

// 检查是否需要更新，需要的情况通知
func NotifyUpdate() error {
	needUpdate, err := CheckUpdate()
	if err != nil {
		return err
	}
	if needUpdate {
		fmt.Println("发现新版本：", latestVersionStr)
	}
	return nil
}

// 多个版本字符串，比较最新版本
// 字符串是v1.0.0这种格式的
// func LastestVersion(version... string){
// versionPrefix:="v"
// for
// }

func GithubReleaseVersion(latestURL string) (version string) {
	for l := len(latestURL) - 1; l >= 0; l-- {
		if latestURL[l] == 'v' {
			version = latestURL[l+1:]
			downloadPrefix = latestURL[:l-4] + "download/v" + version + "/"
			return
		}
	}
	return
}

func Update(systemInfo *sysinfo.SystemInfo) {
	needUpdate, err := CheckUpdate()
	if err != nil {
		log.Fatalln("check update err:", err.Error())
	}
	if !needUpdate {
		log.Fatalln("已经是最新版本：", latestVersionStr)
		return
	}
	// 版本需要更新
	fmt.Printf("发现新版本! %v\n", latestVersionStr)

	achieveSuffix := ".tar.gz"
	// if runtime.GOOS == "windows" {
	// 	achieveSuffix = ".zip"
	// }
	fileNameList := []string{
		"ghs",
		latestVersionStr,
		systemInfo.GOOS,
		systemInfo.GOARCH,
	}
	fileName := strings.Join(fileNameList, "_") + achieveSuffix
	latestDownloadURL := downloadPrefix + fileName

	fmt.Printf(`下载地址:%s
	`, latestDownloadURL)
	os.Exit(0)

}
