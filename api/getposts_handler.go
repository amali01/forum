package api

import (
	"encoding/json"
	"fmt"
	"forum/funcs"
	"net/http"
)

type post_json struct {
	User_ID       string `json:"user_id"`
	Title         string `json:"title"`
	Category      string `json:"category"`
	Creation_Date string `json:"creation_date"`
}

type posts_capsul_json struct {
	Posts []post_json `json:"posts"`
}

func GetPostsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	posts_map := funcs.Get_posts_from_db()
	var posts_arr []post_json

	for idx := range posts_map["user_id"] {
		posts_arr = append(posts_arr, post_json{
			User_ID:       posts_map["user_id"][idx],
			Title:         posts_map["title"][idx],
			Category:      "test",
			Creation_Date: posts_map["creation_date"][idx],
		})
	}

	JSON_Response := posts_capsul_json{
		Posts: posts_arr,
	}
	// Marshal the data into JSON format
	jsonData, err := json.Marshal(JSON_Response)
	if err != nil {
		fmt.Println("Error marshaling JSON:", err)
		return
	}

	// Set the content type to JSON
	w.Header().Set("Content-Type", "application/json")

	// Write the JSON data to the response writer
	w.Write(jsonData)

}
