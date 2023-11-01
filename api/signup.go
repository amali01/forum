package api

import (
	"encoding/json"
	"fmt"
	"forum/funcs"
	"io"
	"net/http"
	"text/template"
)

type Person struct {
	Email    string
	Name     string
	Password string
}

func SignUp(w http.ResponseWriter, r *http.Request) {
	// Get method, serve the page
	if r.Method == http.MethodGet {
		// Parse the template
		tmpl, err := template.ParseFiles("templates/html/signup.html")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		/*
		   // Define data to be passed to the template
		   data := struct{ Name string }{
		       Name: "Gopher",
		   }*/

		// Execute the template with the data
		if err := tmpl.Execute(w, nil); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		// Post method, serve the request
	} else if r.Method == http.MethodPost {
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

		funcs.AddUser(data.Name, data.Password)
		fmt.Printf("Name: %s, Email: %s, Password: %s", data.Name, data.Email, data.Password)
	}

}
