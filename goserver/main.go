package main

import (
	"github.com/mudssky/simple-http-file-server/goserver/global"
	"github.com/mudssky/simple-http-file-server/goserver/router"
	"github.com/mudssky/simple-http-file-server/goserver/util"
)

func main() {
	// cmd.Execute()
	var r = router.InitRouter()
	r.Run(":" + util.Itoa(global.Config.Port)) // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}
