package api

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

type Person struct {
	Email    string
	Name     string
	Password string
}

func SignUp(w http.ResponseWriter, r *http.Request) {
	// Read the request body
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Failed to read request body", http.StatusInternalServerError)
		return
	}

	var data Person

	// Unmarshal the JSON data from the request body
	if err := json.Unmarshal(body, &data); err != nil {
		http.Error(w, "Failed to unmarshal JSON", http.StatusBadRequest)
		return
	}

	fmt.Println(data)

}
