package util

import (
	"net"
)

// 获取本地ip地址列表
func ClientIPs() (IPs []string, err error) {
	// 这个函数返回系统单播地址的列表。
	addrs, err := net.InterfaceAddrs()
	if err != nil {
		return IPs, err
	}
	for _, address := range addrs {

		// 检查ip地址判断是否回环地址
		if ipnet, ok := address.(*net.IPNet); ok && !ipnet.IP.IsLoopback() {
			// 判断是否为ipv4
			if ipnet.IP.To4() != nil {
				IPs = append(IPs, ipnet.IP.String())
			}
		}
	}
	return

}

// 判断是否为内网IP
func IsLANIP(IP string) bool {
	prefix := IP[:3]
	// 内网IP，可能是10，172，192开头的
	return prefix == "10." || prefix == "172" || prefix == "192"
}
