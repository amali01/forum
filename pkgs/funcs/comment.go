package funcs

import (
	"fmt"
	"strings"
)

func CreateComment(userID int, postID int, content string) error {
	// Trimming whitespace from the content
	content = strings.TrimSpace(content)
	if content == "" {
		return fmt.Errorf("Message cannot be empty")
	}
	var postExists bool
	// Checking if the post ID exists in the database
	query := "SELECT EXISTS (SELECT 1 FROM posts WHERE p_id = ?)"
	if err := DB.QueryRow(query, postID).Scan(&postExists); err != nil {
		return fmt.Errorf("Post does not exist")
	}
	if !postExists {
		return fmt.Errorf("Post does not exist")
	}

	//////////////////////////////////////////////////////////////////

	// Inserting the comment data into the database
	query = "INSERT INTO comments (post_id,user_id,comment) VALUES (?,?,?);"
	if _, err := DB.Exec(query, postID, userID, content); err != nil {
		return fmt.Errorf("Failed to insert the comment")
	}
	return nil

}
