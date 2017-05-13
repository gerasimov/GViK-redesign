package main

import (
	"fmt"
)

func getChromePath() string {
	return "chrome.exe"
}

func main() {
	var path string = getChromePath()
	fmt.Println(path)
}
