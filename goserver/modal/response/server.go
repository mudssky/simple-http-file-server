package response

type ServerInfoRes struct {
	LocalIPList []string `json:"localIpList"` //本地IP列表
	Port        int      `json:"port"`        // 本地端口
}
