package api

import (
	"encoding/json"
	"fmt"
	"forum/funcs"
	"net/http"
	"strconv"
)

type post_json struct {
	User_ID       string `json:"user_id"`
	Title         string `json:"title"`
	Category      string `json:"category"`
	Creation_Date string `json:"creation_date"`
	Likes_Count   int    `json:"likes_count"`
}

type posts_capsul_json struct {
	Posts []post_json `json:"posts"`
}

/* A function that retrieve posts, (used for mainpage posts listing) */
func GetPostsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	posts_map := funcs.Get_posts_from_db() // Will get posts from db
	var posts_arr []post_json              // used to store posts in an array of type post_json

	for idx := range posts_map["user_id"] {
		post_ideee, _ := strconv.Atoi(posts_map["post_id"][idx]) // converts post_id to integer
		countLikes, _ := funcs.CountPostLikes(post_ideee)        // gets likes count for this post in this idx
		posts_arr = append(posts_arr, post_json{                 // Append this post into posts_arr array
			User_ID:       posts_map["user_id"][idx],
			Title:         posts_map["title"][idx],
			Category:      "test",
			Creation_Date: posts_map["creation_date"][idx],
			Likes_Count:   countLikes.LikeCount,
		})
	}

	/* Used to encapsulate the struct into one struct that is used to construct JSON for sending to front-end */
	JSON_Response := posts_capsul_json{
		Posts: posts_arr,
	}
	/* Marshal the data into JSON format */
	jsonData, err := json.Marshal(JSON_Response)
	if err != nil {
		fmt.Println("Error marshaling JSON:", err)
		return
	}

	/* Set the content type to JSON */
	w.Header().Set("Content-Type", "application/json")

	/* Write the JSON data to the response writer */
	w.Write(jsonData)

}
