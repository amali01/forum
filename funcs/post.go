package funcs

import (
	"fmt"
	"strings"
)

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

func GetCategoryID(category string) (int, error) {
	query := "SELECT cat_id FROM category WHERE category = ?"
	row := DB.QueryRow(query, category)

	var catID int
	if err := row.Scan(&catID); err != nil {
		return 0, err
	}
	return catID, nil
}

func CreateCategory(userId int, categoryName string) error {
	if !UserIsType(userId, "admin") {
		return fmt.Errorf("only admins can create categories")
	}
	query := "INSERT INTO category (category) VALUES (?)"
	if _, err := DB.Exec(query, categoryName); err != nil {
		return err
	}
	return nil
}
