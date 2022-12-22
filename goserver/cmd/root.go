/*
Copyright © 2022 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"os"

	"github.com/spf13/cobra"
)

// rootCmd represents the base command when called without any subcommands
var rootCmd = &cobra.Command{
	Use:   "goserver",
	Short: "go http file server",
	Long:  `go本地文件服务器`,
	Run: func(cmd *cobra.Command, args []string) {
		// Do Stuff Here
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
	rootCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
	rootCmd.Flags().Uint16P("port", "p", 5006, "server start port")
	rootCmd.Flags().StringP("config", "c", "", "config file path")
	rootCmd.Flags().BoolP("verbose", "v", false, "log more message")
	Execute()
	return rootCmd
}
