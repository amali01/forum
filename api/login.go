package api

import (
	"encoding/json"
	"fmt"
	"forum/funcs"
	"forum/hashing"
	"io"
	"net/http"
	"text/template"
	"time"

	"github.com/gofrs/uuid"
)

func LogIn(w http.ResponseWriter, r *http.Request) {

	// Get method, serve the page
	if r.Method == http.MethodGet {
		// Parse the template
		tmpl, err := template.ParseFiles("templates/html/login.html")
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

		// Check if passwords matches
		hash_matched := hashing.CheckPasswordHash(data.Password, funcs.GetUserHash(data.Name)) // ignore error for the sake of simplicity

		if !hash_matched {
			io.WriteString(w, "Pass doesn't match!")
			return
		}

		/*	if IsLoggedIn(data.Name) {
			io.WriteString(w, "Already logged in")
			return
		}*/
		//fmt.Printf("Name: %s, Email: %s, Password: %s", data.Name, data.Email, data.Password)

		// Create a seesion for this user

		// Generate a new UUID
		userUUID, err := uuid.NewV4()
		if err != nil {
			// Handle the error
		}
		// Associate the UUID with the user in your session or database
		userSession := Session{
			username:    data.Name,
			SessionUUID: userUUID.String(),
			expiry:      time.Now().Add(20 * time.Second),
		}
		Sessions[userSession.SessionUUID] = userSession

		http.SetCookie(w, &http.Cookie{
			Name:    "session_token",
			Value:   userSession.SessionUUID,
			Expires: userSession.expiry,
		})

		fmt.Printf("UUID: %s\n", userSession.SessionUUID)

		go EXPIRED(userSession)
	}

}

func EXPIRED(userSession Session) {
	{
		for !userSession.IsExpired() {
		}
		fmt.Println("EXPIRED")
	}
}

func IsLoggedIn(user string) bool {
	if _, ok := Sessions[user]; ok {
		if !Sessions[user].IsExpired() {
			fmt.Println("Already logged in")
			return true
		}
	}
	return false
}
