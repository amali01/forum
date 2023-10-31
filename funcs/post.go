package funcs

import (
	"fmt"
	"strings"
)

// didn't try it yet
func CreatePost(userID int, category string, content string) error {
	catId, err := GetCategoryID(category)
	if err != nil {
		return err
	}
	content = strings.TrimSpace(content)
	if content == "" {
		return fmt.Errorf("message cannot be empty")
	}
	query := "INSERT INTO posts (user_id, category, post) VALUES (?, ?, ?)"
	if _, err := DB.Exec(query, userID, catId, content); err != nil {
		return err
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
	if !UserIsAdmin(userId) {
		return fmt.Errorf("only admins can create categories")
	}
	query := "INSERT INTO category (category) VALUES (?)"
	if _, err := DB.Exec(query, categoryName); err != nil {
		return err
	}
	return nil
}
