package main

import (
	"fmt"
	"forum/api"
	"forum/controllers"
	"forum/funcs"
	"log"
	"net/http"
)

func main() {
	funcs.Init()

	// Create a file server to serve static files (CSS, JS, images, etc.)
	fs := http.FileServer(http.Dir("static"))

	// Handle requests for files in the "/static/" path
	http.Handle("/static/", http.StripPrefix("/static/", fs))

	// Handle signup
	http.HandleFunc("/signup", api.SignUp)
	// Handle login
	http.HandleFunc("/login", api.LogIn)

	// create post
	http.HandleFunc("/create_post", api.Create_Post)
	// create category
	http.HandleFunc("/create_category", api.Create_Category_Handler)
	// Handle Create comment
	http.HandleFunc("/add_comment", api.AddCommentHandler)
	// Handle Likes & Dislikes for Posts
	http.HandleFunc("/likes_post", api.LikesPostHandler)
	// Handle Likes & Dislikes for Posts
	http.HandleFunc("/likes_comment", api.LikesCommentHandler)

	/*http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		controllers.RenderPage(w, r, funcs.DB)
	})*/

	http.HandleFunc("/", api.GetPostsHandler)

	http.HandleFunc("/category/", func(w http.ResponseWriter, r *http.Request) {
		controllers.RenderCategoryPage(w, r, funcs.DB)
	})

	http.HandleFunc("/post/", func(w http.ResponseWriter, r *http.Request) {
		controllers.RenderPostPage(w, r, funcs.DB)
	})

	http.HandleFunc("/user/", func(w http.ResponseWriter, r *http.Request) {
		controllers.RenderUserPage(w, r, funcs.DB)
	})

	fmt.Println("Server is live on port http://localhost:8080 ...")
	log.Fatal(http.ListenAndServe(":8080", nil))

	if err := funcs.DB.Close(); err != nil {
		fmt.Println("Error :", err)
	}
}

// A middleware used for authenticate access to participate in the forum
// All create, edit, post, comment handlers should be passed in this middleware handler
func Session_midddle(in_http http.Handler) http.Handler {

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("session_token")
		if err != nil {
			if err == http.ErrNoCookie {
				// If the cookie is not set, return an unauthorized status
				w.WriteHeader(http.StatusUnauthorized)
				return
			}
			// For any other type of error, return a bad request status
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		// Get cookie value
		session_token := cookie.Value

		// We then get the session from our session map
		userSession, exists := api.Sessions[session_token]
		if !exists {
			// If the session token is not present in session map, return an unauthorized error
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		// If the session is present, but has expired, we can delete the session, and return
		// an unauthorized status
		if userSession.IsExpired() {
			delete(api.Sessions, session_token)
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		// If the session is valid, return a welcome message to the user
		fmt.Fprintf(w, "Welcome %d!", userSession.Get_UserID())

		in_http.ServeHTTP(w, r)
	})
}
