package util

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
)

var commands = map[string]string{
	"windows": "explorer",
	"darwin":  "open",
	"linux":   "xdg-open",
}

func Open(uri string) error {
	run, ok := commands[runtime.GOOS]
	if !ok {
		return fmt.Errorf("don't know how to open things on %s platform", runtime.GOOS)
	}

	cmd := exec.Command(run, uri)
	return cmd.Start()
}

func AbsWorkDir() (dir string, err error) {
	dir, err = os.Getwd()
	return
}

func AbsWorkDirSlash() (dir string, err error) {
	dir, err = AbsWorkDir()
	if err != nil {
		return
	}
	// 对分隔符的斜线进行替换，换成linux的路径形式，这样适合拼接到url
	dir = filepath.ToSlash(dir)
	return
}
