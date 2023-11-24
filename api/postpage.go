package api

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/google/uuid"
)

type SampleJson struct {
	UID           string `json:"UID"`
	Text          string `json:"Text"`
	Categroy      string `json:"Categroy"`
	Creation_date string `json:"Creation_date"`
}

func JsonToFront(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("content-type", "application/json")

	var JData []SampleJson

	for i := 0; i < 10; i++ {
		JData = append(JData, SampleJson{Text: fmt.Sprintf("Sacred-Content %d", i), Categroy: "test", UID: uuid.New().String(), Creation_date: "Nov 15"})
	}

	tosend, err := json.Marshal(JData)
	if err != nil {
		fmt.Println(err)
	}
	w.Write(tosend)
	fmt.Println(string(tosend))
}

func ServeMainPage(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "barebones/mainpage.html")
}
