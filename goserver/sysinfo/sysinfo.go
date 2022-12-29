package sysinfo

import (
	"os"
	"runtime"
)

type SystemInfo struct {
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
	return

}
