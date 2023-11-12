package api

import (
	"encoding/json"
	"fmt"
	"forum/funcs"
	"net/http"
)

type Post_JSON struct {
	User_ID       string `json:"user_id"`
	Title         string `json:"title"`
	Category      string `json:"category"`
	Creation_Date string `json:"creation_date"`
}

func GetPostsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	posts_map := funcs.Get_posts_from_db()

	posts_wahid := Post_JSON{
		User_ID:       posts_map["user_id"][0],
		Title:         posts_map["title"][0],
		Category:      "test",
		Creation_Date: posts_map["creation_date"][0],
	}
	// Marshal the data into JSON format
	jsonData, err := json.Marshal(posts_wahid)
	if err != nil {
		fmt.Println("Error marshaling JSON:", err)
		return
	}

	// Set the content type to JSON
	w.Header().Set("Content-Type", "application/json")

	// Write the JSON data to the response writer
	w.Write(jsonData)

}
