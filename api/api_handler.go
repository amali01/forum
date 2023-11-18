package api

import (
	"net/http"
)

func API_Handler(w http.ResponseWriter, r *http.Request) {
	request_path := r.URL.Path

	switch request_path {

	// lists posts
	case "posts":
		GetPostsHandler(w, r)

	// Takes a JSON and creates a post
	case "create_post":
		Create_Post(w, r)

	// Creates category
	case "create_category":
		Create_Category_Handler(w, r)

	// adds a comment
	case "add_comment":
		AddCommentHandler(w, r)

	// Likes a post
	case "likes_post":
		// Handle Likes & Dislikes for Posts
		LikesPostHandler(w, r)

	// likes a comment
	case "likes_comment":
		// Handle Likes & Dislikes for Posts
		LikesCommentHandler(w, r)
	}

}
