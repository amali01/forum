package funcs

import (
	"fmt"
	"strconv"
	"strings"
)

func GetPostID(postID string) (int, error) {
	var postExists bool
	Id, err := strconv.Atoi(postID)
	if err != nil {
		return 0, err
	}
	// Checking if the post ID exists in the database
	query := "SELECT EXISTS (SELECT 1 FROM posts WHERE p_id = ?)"
	if err := DB.QueryRow(query, Id).Scan(&postExists); err != nil {
		return 0, err
	}
	if !postExists {
		return 0, fmt.Errorf("Post does not exist")
	}

	return Id, nil
}

func CreatePost(userID int, category string, content string) error {
	// Fetching Category ID
	catID, err := GetCategoryID(category)
	if err != nil {
		return fmt.Errorf("Category does not exist")
	}

	// Trimming whitespace from the content
	content = strings.TrimSpace(content)
	if content == "" {
		return fmt.Errorf("Message cannot be empty")
	}

	//////////////////////////////////////////////////////////////////

	// Inserting post data into the database
	query := "INSERT INTO posts (user_id, post) VALUES (?, ?)"
	result, err := DB.Exec(query, userID, content)
	if err != nil {
		return fmt.Errorf("Failed to insert the post")
	}

	lastID, err := result.LastInsertId()
	if err != nil {
		return fmt.Errorf("Failed to retrieve the last inserted ID")
	}
	postID := int(lastID)

	// Inserting the post category into the database
	query = "INSERT INTO threads (post_id, cat_id) VALUES (?, ?)"
	if _, err := DB.Exec(query, postID, catID); err != nil {
		return fmt.Errorf("Failed to insert the post category")
	}
	return nil

}
