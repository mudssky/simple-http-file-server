package util

import (
	"fmt"
	"net"
)

// 获取本地ip地址列表
func ClientIPs() (IPs []string, err error) {
	// 这个函数返回系统单播地址的列表。
	addrs, err := net.InterfaceAddrs()
	if err != nil {
		return
	}
	// for _, address := range addrs {

	// 	// 检查ip地址判断是否回环地址
	// 	if ipnet, ok := address.(*net.IPNet); ok && !ipnet.IP.IsLoopback() {
	// 		// 判断是否为ipv4
	// 		if ipnet.IP.To4() != nil {
	// 			IPs = append(IPs, ipnet.IP.String())
	// 		}
	// 	}
	// }

	for _, addr := range addrs {
		ipAddr, ok := addr.(*net.IPNet)
		if !ok {
			continue
		}
		if ipAddr.IP.IsLoopback() {
			continue
		}
		if !ipAddr.IP.IsGlobalUnicast() {
			continue
		}
		IPs = append(IPs, ipAddr.IP.String())
	}
	return

}

// 判断是否为内网IP
func IsLANIP(IP string) bool {
	prefix := IP[:3]
	fmt.Println(prefix, IP)
	// 内网IP，可能是10，172，192开头的
	return prefix == "10." || prefix == "172" || prefix == "192"
}

// 获取外网地址
func ExternalIP() (IP string, err error) {
	conn, err := net.Dial("udp", "8.8.8.8:80")
	if err != nil {
		return "", err
	}
	defer conn.Close()
	localAddr := conn.LocalAddr().(*net.UDPAddr)
	return localAddr.IP.String(), nil
}

// 获取服务器ip相关信息，其中内网ip在前，外网ip放在最后面
func ServerIPs() (IPs []string, err error) {
	IPs, err = ClientIPs()
	if err != nil {
		return
	}
	outIP, err := ExternalIP()
	if err != nil {
		return nil, err
	}
	IPs = append(IPs, outIP)
	return
}
