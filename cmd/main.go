package main

import (
	"fmt"
	"forum/api"
	"forum/funcs"
	"log"
	"net/http"
)

func main() {
	funcs.Init()

	// Create a file server to serve static files (CSS, JS, images, etc.)
	fs := http.FileServer(http.Dir("static"))

	// Handle requests for files in the "/static/" path
	http.Handle("/static/", http.StripPrefix("/static/", fs))

	// Handle signup
	http.HandleFunc("/signup", api.SignUp)

	log.Fatal(http.ListenAndServe(":8080", nil))

	if err := funcs.DB.Close(); err != nil {
		fmt.Println("Error :", err)
	}
}
