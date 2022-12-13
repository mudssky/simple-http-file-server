package util

import (
	"archive/zip"
	"errors"
	"io/fs"
	"path"
	"strings"

	"io"
	"os"
	"path/filepath"
)

type ZipOpt struct {
	SrcFile           string
	DestZip           string
	IgnorePatternList []string
	DestWriter        io.Writer //使用ZipBytes要传
}

func ZipBytes(opt ZipOpt) error {
	// 压缩后的路径映射
	baseDir := path.Dir(opt.SrcFile)
	if opt.DestWriter == nil {
		return errors.New("DestWriter should not be nil")
	}
	archive := zip.NewWriter(opt.DestWriter)
	defer archive.Close()
	return ExploreDir(ExploreDirOption{
		RootPath:          opt.SrcFile,
		IgnorePatternList: opt.IgnorePatternList,
	},
		func(path string, d fs.DirEntry, err error) error {
			if err != nil {
				return err
			}
			info, err := d.Info()
			if err != nil {
				return err
			}
			header, err := zip.FileInfoHeader(info)
			if err != nil {
				return err
			}
			header.Name = strings.TrimLeft(path, baseDir)
			if info.IsDir() {
				header.Name += "/"
			} else {
				header.Method = zip.Deflate
			}

			writer, err := archive.CreateHeader(header)
			if err != nil {
				return err
			}
			if !info.IsDir() {
				file, err := os.Open(path)
				if err != nil {
					return err
				}
				defer file.Close()
				_, err = io.Copy(writer, file)
				if err != nil {
					return err
				}
			}
			return nil
		})
}

func Zip(opt ZipOpt) error {
	zipfile, err := os.Create(opt.DestZip)
	if err != nil {
		return err
	}
	defer zipfile.Close()
	// 压缩后的路径映射
	baseDir := path.Dir(opt.SrcFile)
	archive := zip.NewWriter(zipfile)
	defer archive.Close()
	return ExploreDir(ExploreDirOption{
		RootPath:          opt.SrcFile,
		IgnorePatternList: opt.IgnorePatternList,
	},
		func(path string, d fs.DirEntry, err error) error {
			if err != nil {
				return err
			}
			info, err := d.Info()
			if err != nil {
				return err
			}
			header, err := zip.FileInfoHeader(info)
			if err != nil {
				return err
			}

			// 移除根路径之前的路径，这样映射后是正常的目录结构
			header.Name = strings.TrimLeft(path, baseDir)
			if info.IsDir() {
				header.Name += "/"
			} else {
				header.Method = zip.Deflate
			}
			writer, err := archive.CreateHeader(header)
			if err != nil {
				return err
			}
			if !info.IsDir() {
				file, err := os.Open(path)
				if err != nil {
					return err
				}
				defer file.Close()
				_, err = io.Copy(writer, file)
				if err != nil {
					return err
				}
			}
			return nil
		})
}

// 解压
func Unzip(zipFile string, destDir string) ([]string, error) {
	zipReader, err := zip.OpenReader(zipFile)
	var paths []string
	if err != nil {
		return []string{}, err
	}
	defer zipReader.Close()

	for _, f := range zipReader.File {
		fpath := filepath.Join(destDir, f.Name)
		paths = append(paths, fpath)
		if f.FileInfo().IsDir() {
			os.MkdirAll(fpath, os.ModePerm)
		} else {
			if err = os.MkdirAll(filepath.Dir(fpath), os.ModePerm); err != nil {
				return []string{}, err
			}
			inFile, err := f.Open()
			if err != nil {
				return []string{}, err
			}
			defer inFile.Close()

			outFile, err := os.OpenFile(fpath, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, f.Mode())
			if err != nil {
				return []string{}, err
			}
			defer outFile.Close()

			_, err = io.Copy(outFile, inFile)
			if err != nil {
				return []string{}, err
			}
		}
	}
	return paths, nil
}
