package server

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"
)

// kill 默认会发送 syscall.SIGTERM 信号
// kill -2 发送 syscall.SIGINT 信号，我们常用的Ctrl+C就是触发系统SIGINT信号
// kill -9 发送 syscall.SIGKILL 信号，但是不能被捕获，所以不需要添加它

func GracefullyShutdown(srv *http.Server) {
	// 等待中断信号以优雅地关闭服务器（设置 5 秒的超时时间）
	quit := make(chan os.Signal, 1)
	// signal.Notify把收到的 syscall.SIGINT或syscall.SIGTERM 信号转发给quit
	signal.Notify(quit, os.Interrupt)
	<-quit
	log.Println("Shutdown Server ...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal("Server Shutdown:", err)
	}
	log.Println("Server exiting")
}
