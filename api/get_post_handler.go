package api

import (
	"encoding/json"
	"fmt"
	"forum/controllers"
	"forum/pkgs/funcs"
	"net/http"
	"strings"
)

// Category page Handler
func Get_post_handler(w http.ResponseWriter, r *http.Request) {
	// Check if the request is not GET && NOT POST requests
	if r.Method != http.MethodGet {
		controllers.HTTPErrorHandler(w, r, http.StatusMethodNotAllowed)
		return
	}

	postID := strings.TrimPrefix(r.URL.Path, "/api/post/")
	//postID_integer, _ := strconv.Atoi(postID)

	json_post, err := funcs.Get_Post(postID)

	if err != nil {
		http.Error(w, "This Post do not exist", http.StatusBadRequest)
		return
	}
	/* Marshal the data into JSON format */
	jsonData, err := json.Marshal(json_post)
	if err != nil {
		fmt.Println("Error marshaling JSON:", err)
		return
	}

	/* Set the content type to JSON */
	w.Header().Set("Content-Type", "application/json")

	/* Write the JSON data to the response writer */
	w.Write(jsonData)
}
