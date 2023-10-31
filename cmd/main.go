package main

import (
	"forum/api"
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/signup", api.SignUp)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
