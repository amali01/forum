package api

import (
	"encoding/json"
	"fmt"
	"forum/pkgs/funcs"
	"forum/pkgs/hashing"
	"io"
	"net/http"
	"text/template"
	"time"

	"github.com/gofrs/uuid"
)

func LogIn(w http.ResponseWriter, r *http.Request) {
	fmt.Println(r.URL.Path)
	// Get method, serve the page
	if r.Method == http.MethodGet {
		// Parse the template
		tmpl, err := template.ParseFiles("static/html/login.html")
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

		var data LogIn_form

		// Unmarshal the JSON data from the request body
		if err := json.Unmarshal(body, &data); err != nil {
			http.Error(w, "Failed to unmarshal JSON", http.StatusBadRequest)
			return
		}
		fmt.Println(data)
		// get user id
		get_user_id, err := funcs.SelectUserID(data.Email)
		if err != nil {
			return
		}

		// Check if passwords matches
		hash_matched := hashing.CheckPasswordHash(data.Password, funcs.GetUserHash(get_user_id)) // ignore error for the sake of simplicity

		if !hash_matched {
			io.WriteString(w, "Pass doesn't match!")
			return
		}
		// Create a seesion for this user

		// Generate a new UUID
		userUUID, err := uuid.NewV4()
		if err != nil {
			// Handle the error
			fmt.Printf("error: %s\n", err)
		}

		// Associate the UUID with the user in your session or database
		userSession := Session{
			userID:      get_user_id,
			SessionUUID: userUUID.String(),
			expiry:      time.Now().Add(3600 * time.Second),
		}
		Sessions[userSession.SessionUUID] = userSession

		// Set a cookie with a session token that can be used to authenticate access without logging in
		http.SetCookie(w, &http.Cookie{
			Name:    "session_token",
			Value:   userSession.SessionUUID,
			Expires: userSession.expiry,
		})

		fmt.Printf("UUID: %s\n", userSession.SessionUUID)

		io.WriteString(w, fmt.Sprintf("Welcome %d", userSession.userID))
		// A go routine to indicate that the session is expired
		go EXPIRED(userSession)
	} else {
		// Handle other HTTP methods or incorrect requests
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

}

func EXPIRED(userSession Session) {
	for !userSession.IsExpired() {
	}
	fmt.Printf("User %d token expired!\n", userSession.userID)
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
