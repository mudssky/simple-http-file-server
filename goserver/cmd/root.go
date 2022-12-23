/*
Copyright © 2022 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"os"

	"github.com/mudssky/simple-http-file-server/goserver/util"
	"github.com/spf13/cobra"
)

// rootCmd represents the base command when called without any subcommands
var rootCmd = &cobra.Command{
	Use:   "ghs",
	Short: "go http file server",
	Long:  `go本地文件服务器`,
	Run: func(cmd *cobra.Command, args []string) {

	},
}

// Execute adds all child commands to the root command and sets flags appropriately.
// This is called by main.main(). It only needs to happen once to the rootCmd.
func Execute() {
	err := rootCmd.Execute()
	if err != nil {
		os.Exit(1)
	}

}

func InitFlag() *cobra.Command {

	workdir, _ := util.AbsWorkDirSlash()
	rootCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
	rootCmd.Flags().Uint16P("port", "p", 5006, "server start port")
	rootCmd.Flags().StringP("config", "c", "", "config file path")
	rootCmd.Flags().BoolP("verbose", "v", false, "log more message")
	rootCmd.Flags().BoolP("open", "", false, "open default browser")
	rootCmd.Flags().StringP("folderlist", "", workdir, "config file path")
	rootCmd.Flags().StringP("usermap", "", "", "user data json  to login")
	// rootCmd.Flags().StringP("username", "u", "mudssky", "username to login")
	// rootCmd.Flags().StringP("password", "v", "mudssky", "username to login")
	// 弹出帮助信息时，直接退出后续程序执行。
	// cobra这边只用于解析命令了。
	rootCmd.SetHelpFunc(func(c *cobra.Command, s []string) {
		c.Usage()
		os.Exit(0)
	})
	Execute()
	return rootCmd
}
