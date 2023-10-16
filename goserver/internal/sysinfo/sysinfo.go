package sysinfo

import (
	"os"
	"path/filepath"
	"runtime"
)

type SystemInfo struct {
	// 程序所在文件夹
	ProgramFolder string
	// 执行程序所在的路径
	ProgramPath string
	HomePath    string
	GOOS        string
	GOARCH      string
}

func Info() (info *SystemInfo, err error) {
	info = new(SystemInfo)
	info.HomePath, err = os.UserHomeDir()
	if err != nil {
		return
	}
	info.GOOS = runtime.GOOS
	info.GOARCH = runtime.GOARCH
	info.ProgramPath = os.Args[0]
	info.ProgramFolder = filepath.Dir(info.ProgramPath)
	return
}
