package funcs

import (
	"fmt"
	"strings"
)

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
	// Trimming whitespace from the categoryName
	categoryName = strings.TrimSpace(categoryName)
	if categoryName == "" {
		return fmt.Errorf("Category cannot be empty")
	}

	catID, err := GetCategoryID(categoryName)
	if err != nil {
		// Inserting category data into the database
		query := "INSERT INTO category (category) VALUES (?)"
		if _, err := DB.Exec(query, categoryName); err != nil {
			return fmt.Errorf("Failed to insert the category")
		}
		return nil
	}
	if catID != 0 {
		return fmt.Errorf("This Category already exist")
	}
	///////////////////////////////////////////////////////////////////////////
	query := "INSERT INTO category (category) VALUES (?)"
	if _, err := DB.Exec(query, categoryName); err != nil {
		return err
	}
	return nil
}
