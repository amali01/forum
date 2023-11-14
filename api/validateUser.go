package api

import (
	"fmt"
	"net/http"
)

func ValidateUser(w http.ResponseWriter, r *http.Request) (*Session, bool) {
	cookie, err := r.Cookie("session_token")
	if err != nil {
		if err == http.ErrNoCookie {
			// If the cookie is not set, return an unauthorized status
			w.WriteHeader(http.StatusUnauthorized)
			return nil, false
		}
		// For any other type of error, return a bad request status
		w.WriteHeader(http.StatusBadRequest)
		return nil, false
	}

	// Get cookie value
	session_token := cookie.Value

	// We then get the session from our session map
	userSession, exists := Sessions[session_token]
	if !exists {
		// If the session token is not present in session map, return an unauthorized error
		w.WriteHeader(http.StatusUnauthorized)
		return nil, false
	}

	// If the session is present, but has expired, we can delete the session, and return
	// an unauthorized status
	if userSession.IsExpired() {
		delete(Sessions, session_token)
		w.WriteHeader(http.StatusUnauthorized)
		return nil, false
	}

	// If the session is valid, return a welcome message to the user
	fmt.Fprintf(w, "Welcome %d!", userSession.Get_UserID())
	return &userSession, true // return the session
}
