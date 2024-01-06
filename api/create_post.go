package api

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"

	"forum/pkgs/funcs"
)

type Post struct {
	Post       string
	Title      string
	Categories []string
}

func Create_Post(w http.ResponseWriter, r *http.Request) {
	// Handling only POST method requests
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	userSession, valid := ValidateUser(w, r)

	if !valid {
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

	// Remove leading and trailing white spaces from the title,post content and checks if it is empty
	if checkEmpty(&data.Post) || checkEmpty(&data.Title) {
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, "Title and Post Content are required")
		return
	}

	categorysName := strings.TrimSpace(strings.Join(data.Categories, " "))
	if len(categorysName) < 1 {
		data.Categories = []string{"General"}
	}

	err = funcs.CreatePost(userSession.Get_UserID(), data.Title, data.Categories, data.Post)
	if err != nil {
		http.Error(w, fmt.Sprintf("%s", err), http.StatusBadRequest)
		return
	}

	fmt.Println("POST CREATED SUCCESS")

	// w.WriteHeader(http.StatusOK)
	w.Write([]byte("OK!"))
}
