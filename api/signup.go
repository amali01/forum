package api

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strings"
	"text/template"

	"forum/pkgs/funcs"
	"forum/pkgs/hashing"
)

func SignUp(w http.ResponseWriter, r *http.Request) {
	// Get method, serve the page
	if r.Method == http.MethodGet {
		// Parse the template
		tmpl, err := template.ParseFiles("static/html/signup.html")
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

		var data SignUp_form

		// Unmarshal the JSON data from the request body
		if err := json.Unmarshal(body, &data); err != nil {
			http.Error(w, "Failed to unmarshal JSON", http.StatusBadRequest)
			return
		}

		// Remove leading and trailing white spaces from the email,user name and checks if it is empty
		if checkEmpty(&data.Email) || checkEmpty(&data.Name) {
			w.WriteHeader(http.StatusBadRequest)
			io.WriteString(w, "Username and email are required")
			return
		}

		// checks if the password have any whitespace in it
		if err := checkPass(&data.Password); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			io.WriteString(w, err.Error())
			return
		}

		// Hash the password before adding it
		hash, _ := hashing.HashPassword(data.Password) // ignore error for the sake of simplicity

		if err := funcs.AddUser(data.Name, data.Email, hash); err != nil {
			w.WriteHeader(http.StatusConflict)
			io.WriteString(w, err.Error())
			return
		}

		io.WriteString(w, "Add user success")
		fmt.Printf("Name: %s, Email: %s, Password: %s", data.Name, data.Email, data.Password)
	} else {
		// Handle other HTTP methods or incorrect requests
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
}

// Remove leading and trailing white spaces from the email and checks if it is empty
func checkEmpty(email *string) bool {
	*email = strings.TrimSpace(*email)

	if *email == "" {

		return true
	}
	return false
}

// checkPass checks if the given password string contains any whitespace characters.
// It returns true if there are whitespace characters, and false otherwise.
func checkPass(pass *string) error {
	if strings.ContainsAny(*pass, " \t\n\r\v\f") {
		return errors.New("password cannot contain whitespace")
	}
	return nil
}
