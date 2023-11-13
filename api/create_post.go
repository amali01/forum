package api

import (
	"encoding/json"
	"fmt"
	"forum/funcs"
	"io"
	"net/http"
)

type Post struct {
	Post     string
	Title    string
	Category string
}

func Create_Post(w http.ResponseWriter, r *http.Request) {
	// Handling only POST method requests
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	userSession, valid := ValidateUser(w, r)

	if valid == false {
		w.Write([]byte("Unauthorize access"))
		return
	}
	// Read the request body
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Failed to read request body", http.StatusInternalServerError)
		return
	}

	var data Post

	// Unmarshal the JSON data from the request body into 'data' variable of type Post
	if err := json.Unmarshal(body, &data); err != nil {
		http.Error(w, "Failed to unmarshal JSON", http.StatusBadRequest)
		return
	}

	////////////////////////////////////////////////////////////////////////

	err = funcs.CreatePost(userSession.Get_UserID(), data.Title, data.Category, data.Post)
	if err != nil {
		http.Error(w, fmt.Sprintf("%s", err), http.StatusBadRequest)
		return
	}
	w.Write([]byte("OK!"))
	////////////////////////////////////////////////////////////////////////

}
