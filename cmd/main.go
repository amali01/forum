package main

import (
	"forum/api"
	"forum/funcs"
	"log"
	"net/http"
)

func main() {
	funcs.Init()
	http.HandleFunc("/signup", api.SignUp)
	http.HandleFunc("/mainpage", api.ServeMainPage)
	http.HandleFunc("/getdata", api.JsonToFront)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
