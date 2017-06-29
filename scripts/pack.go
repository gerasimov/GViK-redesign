package main

import (
	"fmt"
)

type test struct {
	Path  string `json:"path"`
	Child []test `json:"child"`
}

type data struct {
}

func (f *data) alert() int {
	return 32
}

func getChromePath() *test {
	return &test{Path: "chrome.exe", Child: []test{}}
}

func main() {
	//val, _ := json.Marshal(getChromePath())
	f := data{}
	fmt.Println(f.alert())
}
