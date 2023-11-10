package api

import (
	"encoding/json"
	"fmt"
	"forum/funcs"
	"io"
	"net/http"
)

type Post struct {
	User_id  int
	Post     string
	Category string
}

func Create_Post(w http.ResponseWriter, r *http.Request) {
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

	// Unmarshal the JSON data from the request body
	if err := json.Unmarshal(body, &data); err != nil {
		http.Error(w, "Failed to unmarshal JSON", http.StatusBadRequest)
		return
	}
	fmt.Println(data)

	funcs.CreatePost(userSession.Get_UserID(), data.Category, data.Post)

	w.Write([]byte("OK!"))
}
