// Package docs GENERATED BY SWAG; DO NOT EDIT
// This file was generated by swaggo/swag
package docs

import "github.com/swaggo/swag"

const docTemplate = `{
    "schemes": {{ marshal .Schemes }},
    "swagger": "2.0",
    "info": {
        "description": "{{escape .Description}}",
        "title": "{{.Title}}",
        "termsOfService": "http://swagger.io/terms/",
        "contact": {
            "name": "API Support",
            "url": "http://www.swagger.io/support",
            "email": "support@swagger.io"
        },
        "license": {
            "name": "Apache 2.0",
            "url": "http://www.apache.org/licenses/LICENSE-2.0.html"
        },
        "version": "{{.Version}}"
    },
    "host": "{{.Host}}",
    "basePath": "{{.BasePath}}",
    "paths": {
        "/createTxt": {
            "post": {
                "description": "传入文件名和内容，创建txt文本文件",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "filelist"
                ],
                "summary": "创建txt文本文件",
                "parameters": [
                    {
                        "description": "创建txt需要的参数",
                        "name": "data",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/request.TxtFile"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "操作成功",
                        "schema": {
                            "allOf": [
                                {
                                    "$ref": "#/definitions/response.Response"
                                },
                                {
                                    "type": "object",
                                    "properties": {
                                        "data": {
                                            "type": "object"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        },
        "/downloadItem": {
            "post": {
                "description": "传入fileitem下载指定项目，文件夹和文件的情况区别处理",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "filelist"
                ],
                "summary": "下载项目",
                "parameters": [
                    {
                        "description": "下载文件对应的信息",
                        "name": "data",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/response.FileInfo"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "操作成功",
                        "schema": {
                            "allOf": [
                                {
                                    "$ref": "#/definitions/response.Response"
                                },
                                {
                                    "type": "object",
                                    "properties": {
                                        "data": {
                                            "type": "object"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        },
        "/filelist": {
            "post": {
                "description": "传入路径获取文件列表，不传参时返回根列表",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "filelist"
                ],
                "summary": "传入文件夹路径获取文件列表，不传参时返回根列表",
                "parameters": [
                    {
                        "description": "文件列表路径",
                        "name": "data",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/request.FilePath"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "文件列表信息",
                        "schema": {
                            "allOf": [
                                {
                                    "$ref": "#/definitions/response.Response"
                                },
                                {
                                    "type": "object",
                                    "properties": {
                                        "data": {
                                            "type": "array",
                                            "items": {
                                                "$ref": "#/definitions/response.FileInfo"
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        },
        "/getServerInfo": {
            "get": {
                "description": "获取本地ip等服务器信息",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "server"
                ],
                "summary": "获取服务器信息",
                "responses": {
                    "200": {
                        "description": "操作成功",
                        "schema": {
                            "allOf": [
                                {
                                    "$ref": "#/definitions/response.Response"
                                },
                                {
                                    "type": "object",
                                    "properties": {
                                        "data": {
                                            "$ref": "#/definitions/response.ServerInfoRes"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        },
        "/mkdir": {
            "post": {
                "description": "传入文件夹的路径，新建文件夹",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "filelist"
                ],
                "summary": "新建文件夹",
                "parameters": [
                    {
                        "description": "目录信息",
                        "name": "data",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/request.OprateFilePath"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "操作成功",
                        "schema": {
                            "allOf": [
                                {
                                    "$ref": "#/definitions/response.Response"
                                },
                                {
                                    "type": "object",
                                    "properties": {
                                        "data": {
                                            "type": "object"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        },
        "/removeItem": {
            "post": {
                "description": "传入路径，删除目录或文件",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "filelist"
                ],
                "summary": "删除目录或文件",
                "parameters": [
                    {
                        "description": "路径",
                        "name": "data",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/request.OprateFilePath"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "操作成功",
                        "schema": {
                            "allOf": [
                                {
                                    "$ref": "#/definitions/response.Response"
                                },
                                {
                                    "type": "object",
                                    "properties": {
                                        "data": {
                                            "type": "object"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        },
        "/renameItem": {
            "post": {
                "description": "传入文件名和路径，重命名文件或文件夹",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "filelist"
                ],
                "summary": "重命名文件或文件夹",
                "parameters": [
                    {
                        "description": "重命名需要的参数",
                        "name": "data",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/request.Rename"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "操作成功",
                        "schema": {
                            "allOf": [
                                {
                                    "$ref": "#/definitions/response.Response"
                                },
                                {
                                    "type": "object",
                                    "properties": {
                                        "data": {
                                            "type": "object"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        },
        "/uploadMulti": {
            "post": {
                "description": "传入文件名和内容，创建txt文本文件",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "filelist"
                ],
                "summary": "多文件上传",
                "parameters": [
                    {
                        "description": "创建txt需要的参数",
                        "name": "data",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/request.TxtFile"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "操作成功",
                        "schema": {
                            "allOf": [
                                {
                                    "$ref": "#/definitions/response.Response"
                                },
                                {
                                    "type": "object",
                                    "properties": {
                                        "data": {
                                            "type": "object"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        }
    },
    "definitions": {
        "request.FilePath": {
            "type": "object",
            "properties": {
                "path": {
                    "description": "路径",
                    "type": "string"
                }
            }
        },
        "request.OprateFilePath": {
            "type": "object",
            "required": [
                "path"
            ],
            "properties": {
                "path": {
                    "description": "路径",
                    "type": "string"
                }
            }
        },
        "request.Rename": {
            "type": "object",
            "required": [
                "newName",
                "path"
            ],
            "properties": {
                "newName": {
                    "type": "string"
                },
                "path": {
                    "type": "string"
                }
            }
        },
        "request.TxtFile": {
            "type": "object",
            "required": [
                "path"
            ],
            "properties": {
                "content": {
                    "description": "内容",
                    "type": "string"
                },
                "path": {
                    "description": "创建文本文件的路径",
                    "type": "string"
                }
            }
        },
        "response.FileInfo": {
            "description": "文件信息",
            "type": "object",
            "properties": {
                "isFolder": {
                    "description": "是否是文件夹",
                    "type": "boolean"
                },
                "lastModTime": {
                    "description": "上次修改时间,单位为毫秒",
                    "type": "integer"
                },
                "link": {
                    "description": "静态链接,文件夹则为空串",
                    "type": "string"
                },
                "name": {
                    "description": "文件名",
                    "type": "string"
                },
                "path": {
                    "description": "路径",
                    "type": "string"
                },
                "size": {
                    "description": "文件大小",
                    "type": "integer"
                }
            }
        },
        "response.Response": {
            "type": "object",
            "properties": {
                "code": {
                    "type": "integer"
                },
                "data": {},
                "msg": {
                    "type": "string"
                }
            }
        },
        "response.ServerInfoRes": {
            "type": "object",
            "properties": {
                "localIpList": {
                    "description": "本地IP列表",
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "port": {
                    "description": "本地端口",
                    "type": "integer"
                }
            }
        }
    },
    "securityDefinitions": {
        "BasicAuth": {
            "type": "basic"
        }
    }
}`

// SwaggerInfo holds exported Swagger Info so clients can modify it
var SwaggerInfo = &swag.Spec{
	Version:          "1.0",
	Host:             "127.0.0.1:7888",
	BasePath:         "/api",
	Schemes:          []string{},
	Title:            "Swagger Example API",
	Description:      "This is a sample server celler server.",
	InfoInstanceName: "swagger",
	SwaggerTemplate:  docTemplate,
}

func init() {
	swag.Register(SwaggerInfo.InstanceName(), SwaggerInfo)
}
