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

// holds all the post info
type PostResults struct {
	UserID       int
	Post         string
	CreationDate string
	Title        string
	Edited       bool // can be used later to show it the post been edited
	PostLikes    int  // can be fed from funcs.CountPostLikes()
	PostDislikes int  // can be fed from funcs.CountPostLikes()

}

// Func to get post from database
func GetPost(postID int) (Post_json, error) {
	// Query the database
	rows, err := DB.Query("SELECT user_id, post, creation_date, title, edited FROM posts WHERE p_id = ?", postID)
	if err != nil {
		return Post_json{}, err
	}
	defer rows.Close()

	// Create a struct to hold the result
	var result Post_json

	// Check if a row was returned
	if rows.Next() {
		// Scan the values into the struct fields
		if err := rows.Scan(&result.User_ID, &result.Text, &result.Creation_Date, &result.Title, &result.Edited); err != nil {
			return Post_json{}, err
		}
		/////////////////////////////////////////// can be removed and done somewhere else
		/*LikesCount, _ := CountPostLikes(postID)
		result.PostLikes = LikesCount.LikeCount
		result.PostDislikes = LikesCount.DislikeCount*/
		/////////////////////////////////////////////////
	} else {
		// No row found for the given postID
		return Post_json{}, fmt.Errorf("No post found with ID %d", postID)
	}

	return result, nil
}
