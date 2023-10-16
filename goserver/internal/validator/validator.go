package validator

import (
	"github.com/gin-gonic/gin/binding"
	"github.com/go-playground/validator/v10"
	"github.com/mudssky/simple-http-file-server/goserver/util"
)

var FilePathExist validator.Func = func(fl validator.FieldLevel) bool {
	filepath, ok := fl.Field().Interface().(string)
	if ok {
		isExist, err := util.PathExists(filepath)
		if !isExist || err != nil {
			return false
		}

	}
	return true
}

// 检查文件名是否已经存在,也就是路径存在的取反
var FilePathNotAlreadyExist validator.Func = func(fl validator.FieldLevel) bool {
	return !FilePathExist(fl)
}

func InitValidator() {
	if v, ok := binding.Validator.Engine().(*validator.Validate); ok {
		v.RegisterValidation("path_exist", FilePathExist)
		v.RegisterValidation("path_not_exist", FilePathNotAlreadyExist)
	}
}
