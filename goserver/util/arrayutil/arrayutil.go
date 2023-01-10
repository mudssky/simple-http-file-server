package arrayutil

func Include(strList []string, targetStr string) bool {
	for _, str := range strList {
		if targetStr == str {
			return true
		}
	}
	return false
}
