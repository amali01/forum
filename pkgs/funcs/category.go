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

// Func to get all post IDs of a Category from database
func GetCategoryPosts(catID int) ([]int, error) {
	// Query the database
	rows, err := DB.Query("SELECT post_id FROM threads WHERE cat_id = ?", catID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Create a slice to hold the result
	var result []int

	// Iterate through the rows
	for rows.Next() {
		var postID int

		// Scan the values into the variable's address
		if err := rows.Scan(&postID); err != nil {
			return nil, err
		}

		// Append the current postID to the result slice
		result = append(result, postID)
	}

	// Check if any rows were returned
	if len(result) == 0 {
		// No posts found for the given catID
		return nil, fmt.Errorf("No posts found for category ID %d", catID)
	}

	return result, nil
}

type CategorysContainer struct {
	Categorys []CategoryResults `json:"Categorys"`
}

// holds all the Category info
type CategoryResults struct {
	CatID    int    `json:"cat_id"`
	Category string `json:"category"`
}

func GetAllCategoryInfo() (CategorysContainer, error) {
	var container CategorysContainer

	query := "SELECT cat_id, category FROM category LIMIT 100"
	rows, err := DB.Query(query)
	if err != nil {
		return container, err
	}
	defer rows.Close()

	for rows.Next() {
		var result CategoryResults
		if err := rows.Scan(&result.CatID, &result.Category); err != nil {
			return container, err
		}
		container.Categorys = append(container.Categorys, result)
	}

	return container, nil
}
