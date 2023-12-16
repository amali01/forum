package api

import (
	"encoding/json"
	"fmt"
	"forum/pkgs/funcs"
	"net/http"
)

type posts_capsul_json struct {
	Posts []funcs.Post_json `json:"posts"`
}

/* A function that retrieve posts, (used for mainpage posts listing) */
func GetPostsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	posts_arr, _ := funcs.Get_posts_from_db()

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
