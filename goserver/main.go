package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/mudssky/simple-http-file-server/goserver/global"
	"github.com/mudssky/simple-http-file-server/goserver/util"
)

func main() {
	// cmd.Execute()
	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})

	})

	r.Run(":" + util.Itoa(global.Config.Port)) // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}
