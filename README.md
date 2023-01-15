# ghs
golang http file server


## Overview
ghs是一个命令行启动的文件服务器
支持以下功能
- 文件上传(目录上传，拖拽上传)
- 文件/文件夹（zip打包）下载
- 创建文本，编辑文本，创建目录，文件删除，重命名等功能
- 用户登录
- 使用casbin实现了一套基于角色的权限管理功能
- 地址二维码方便手机使用
- 图片预览功能
- 支持从github检查/更新版本
- 弹幕播放器，可以从同文件夹加载字幕(srt,ass,vtt)和bilibili弹幕(xml)
- 添加aplayer音乐播放器，基于html5的audio标签，支持mp3,m4a等格式

## Install
1. [去发布页面下载](https://github.com/mudssky/simple-http-file-server/releases/)

2. 从源码编译
使用powershell写了一个执行编译的脚本 build.ps1
需要powershell执行环境（https://github.com/PowerShell/PowerShell），
需要pnpm,node,go环境
在根目录执行powershell脚本， goserver目录下就会生成编译好的exe
```shell
build.ps1 -build -Verbose
```

## Usage

建议只在局域网内使用，或者在开启ip白名单后在外网使用。
（开放到公网上可能有安全性问题）

另外只在windows局域网下进行了不充足的测试，应该还有不少bug没发现
因为我没有mac设备，所以没有发布mac的版本。

```
Usage:
  ghs [flags]

Flags:
  -c, --config string       config file path
      --folderlist string   root folder list (default "C:/home/coding/Projects/simple-http-file-server/goserver")
  -h, --help                help for ghs
  -l, --loglevel string     console log level (default "debug")
  -o, --open                open default browser
  -p, --port int            server start port (default 5006)
  -U, --update              update new version
  -v, --verbose             log more message
      --version             version for ghs
```

1. 命令行在对应路径执行

```shell
ghs -o
```

2. 指定启动的端口和配置文件路径

```shell
ghs -o -p 5006 -c ./config.yaml
``` 

3. 指定根路径，可以指定多个
   不指定的情况下默认为程序执行路径
```shell
ghs -o -p 5006 --folderlist='D:/coding','D:/games'
```

## Configuration
配置的优先级
命令行>环境变量>用户指定的配置文件>当前目录配置文件>用户目录配置文件>程序内置默认配置

配置文件存放位置有两个
1. 用户目录/.ghs/ghs.yaml,用户目录在windows下也是就是%USERPROFILE%
2. 程序执行文件所在目录下/ghs.yaml


```yaml
# port: 8792
# folderlist: ['D:/coding']
# 可以按如下配置用户列表，其中role分为四种 visitor是不登录也有的游客类型权限
# 其次可以填admin，
# userlist: [{ username: 'mudssky', password: '123456', role: 'admin' }]
# 控制台输出的记录等级
loglevel: 'info'
# 设置jwt的密钥和过期时间
jwt:
  secret: eqweqeqe
  expires: 3600

# 4种角色的前端权限配置
webpermission:
  # 新建文本，新建目录之类统一归类为write
  # 重命名和删除单独分类
  admin: ['write', 'read', 'rename', 'delete']
  user: ['write', 'read', 'rename']
  visitor: ['read', 'write']
  uploader: ['write']

security:
  # ip白名单，开启后名单外的ip不能访问接口
  ip-whitelist: []
  # 是否信任本地局域网，开启后，局域网的ip即使不在ip白名单内也会放行
  trust-lan: true

```
