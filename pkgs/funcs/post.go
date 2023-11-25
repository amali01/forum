package funcs

import (
	"database/sql"
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
			Likes_Count:   countLikes.LikeCount,
			Post_ID:       column4,
		})
	}

	return results
}

func Get_Post(postID string) (Post_json, error) {
	var postDetails Post_json

	// Create the SQL query
	query := `
        SELECT user_profile.user_name, posts.creation_date, posts.title, posts.post
        FROM posts
        JOIN user_profile ON posts.user_id = user_profile.user_account_id
        WHERE posts.p_id = ?
    `
	// Execute the query and retrieve the row
	row := DB.QueryRow(query, postID)

	// Scan the row values into the postDetails struct
	if err := row.Scan(&postDetails.User_ID, &postDetails.Creation_Date, &postDetails.Title, &postDetails.Text); err != nil {
		if err == sql.ErrNoRows {
			// Post not found
			return Post_json{}, fmt.Errorf("post not found")
		}
		return Post_json{}, err
	}

	// Retrieve categories for the post
	categories, err := Get_Post_Categories(postID)
	if err != nil {
		return Post_json{}, err
	}
	postDetails.Category = categories

	// Post details retrieved successfully
	return postDetails, nil
}

func Get_Post_Categories(postID string) ([]string, error) {
	query := `
        SELECT category
        FROM threads
        JOIN category ON threads.cat_id = category.cat_id
        WHERE post_id = ?
    `

	rows, err := DB.Query(query, postID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var categories []string
	for rows.Next() {
		var category string
		if err := rows.Scan(&category); err != nil {
			return nil, err
		}
		categories = append(categories, category)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return categories, nil
}
