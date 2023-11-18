package funcs

import (
	"fmt"
	"log"
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

func CreatePost(userID int, title string, category string, content string) error {
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
	query := "INSERT INTO posts (user_id, title, post) VALUES (?, ?, ?)"
	result, err := DB.Exec(query, userID, title, content)
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

// Func to get posts from database
func Get_posts_from_db() []Post_json {
	// Query the database
	rows, err := DB.Query("SELECT user_id, creation_date, title, p_id FROM posts LIMIT 100")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	// Create a slice to hold the results
	results := make([]Post_json, 0)

	// Iterate through the rows
	for rows.Next() {
		var column1, column2, column3, column4 string
		if err := rows.Scan(&column1, &column2, &column3, &column4); err != nil {
			log.Fatal(err)
		}
		// Do something with the data, for example, add it to the result slice
		post_ideee, _ := strconv.Atoi(column4)      // converts post_id to integer
		countLikes, _ := CountPostLikes(post_ideee) // gets likes count for this post in this idx
		results = append(results, Post_json{        // Append this post into posts_arr array
			User_ID:       column1,
			Creation_Date: column2,
			Title:         column3,
			Category:      "test",
			Likes_Count:   countLikes.LikeCount,
		})
	}

	return results
}
