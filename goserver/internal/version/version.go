package version

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"path"
	"runtime"
	"strings"

	"github.com/cavaliergopher/grab/v3"
	goversion "github.com/hashicorp/go-version"
	"github.com/mudssky/simple-http-file-server/goserver/conf"
	"github.com/mudssky/simple-http-file-server/goserver/internal/sysinfo"
	"github.com/mudssky/simple-http-file-server/goserver/util"
)

var (
	latestVersionStr string
	downloadPrefix   string
)

func Version() string {
	return strings.TrimSpace(conf.Version)
}

func PrintVersion() {
	version := Version()
	fmt.Printf("ghs: version %s\n", version)
	fmt.Printf("ghs: version %v\n", len(version))

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
		fmt.Printf("发现新版本：%s, run ghs -U to update\n", latestVersionStr)
	}
	return nil
}

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
func removeOldVersion(zipPath, oldPath string) {
	isExist, _ := util.PathExists(oldPath)
	if isExist {
		err := os.Remove(oldPath)
		if err != nil {
			log.Fatalln("del old program error: ", err.Error())
		}
	}

	isZipExist, _ := util.PathExists(zipPath)
	if isZipExist {
		// fmt.Println("unpack zip file succeed")
		// fmt.Println("remove zip...")
		err := os.Remove(oldPath)
		if err != nil {
			log.Fatalln("remove file error:", err.Error())
		}
	}

}

func Update(systemInfo *sysinfo.SystemInfo) {
	needUpdate, err := CheckUpdate()
	if err != nil {
		log.Fatalln("check update err:", err.Error())
	}
	if !needUpdate {
		log.Fatalln("已经是最新版本：", Version())
		return
	}
	// 版本需要更新
	fmt.Printf("发现新版本! %v\n", latestVersionStr)

	achieveSuffix := ".tar.gz"
	if runtime.GOOS == "windows" {
		achieveSuffix = ".zip"
	}
	fileNameList := []string{
		"ghs",
		latestVersionStr,
		systemInfo.GOOS,
		systemInfo.GOARCH,
	}
	zipFileName := strings.Join(fileNameList, "_") + achieveSuffix
	latestDownloadURL := downloadPrefix + zipFileName
	zipPath := path.Join(systemInfo.ProgramFolder, zipFileName)
	binaryName := "ghs"
	if systemInfo.GOOS == "windows" {
		binaryName = "ghs.exe"
	}
	renameTargetPath := path.Join(systemInfo.ProgramFolder, "old_"+binaryName)
	removeOldVersion(zipPath, renameTargetPath)
	fmt.Println("download link:", latestDownloadURL)
	fmt.Println("download path:", systemInfo)
	resp, err := grab.Get(systemInfo.ProgramFolder, latestDownloadURL)
	if err != nil {
		log.Fatal("download update failed:", err)
	}

	fmt.Println("Download saved to", resp.Filename)

	targetPath := path.Join(systemInfo.ProgramFolder, binaryName)
	fmt.Printf("unpack zip file... ,path: %s,target: %s", zipPath, targetPath)
	binaryBytes, err := util.UnzipCertain(zipPath, binaryName)
	if err != nil {
		log.Fatalln("unzip error:", err.Error())
	}

	// 无法向正在运行的程序路径写入内容，或者删除，但是可以重命名、
	// 所以我们只能等下次启动时清理上次的东西了。

	err = os.Rename(targetPath, renameTargetPath)
	if err != nil {
		log.Fatalln("rename file error:", err.Error())
	}
	err = os.WriteFile(targetPath, binaryBytes, os.ModePerm)
	if err != nil {
		log.Fatalln("write file error:", err.Error())
	}

	// fmt.Println("remove zip succeed")
	fmt.Printf("new version %s install succeed,run ghs --version to check", latestVersionStr)
	os.Exit(0)

}
