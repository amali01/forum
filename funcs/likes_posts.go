package funcs

import (
	"database/sql"
	"fmt"
)

func PostLikes(userID int, postID int, action bool) error {
	var postExists bool
	// Checking if the post ID exists in the database
	query := "SELECT EXISTS (SELECT 1 FROM posts WHERE p_id = ?)"
	if err := DB.QueryRow(query, postID).Scan(&postExists); err != nil {
		return err
	}
	if !postExists {
		return fmt.Errorf("Post does not exist")
	}

	//////////////////////////////////////////////////////////////////

	var existingAction bool

	// Checking if there is already an action (like/dislike) on the post by the same user
	query = "SELECT actions_type FROM posts_interaction WHERE post_id = ? AND user_id = ?"
	if err := DB.QueryRow(query, postID, userID).Scan(&existingAction); err != nil {
		if err == sql.ErrNoRows {
			// Inserting the action (like/dislike) data into the database
			query = "INSERT INTO posts_interaction (post_id, user_id, actions_type) VALUES (?, ?, ?)"
			if _, err := DB.Exec(query, postID, userID, action); err != nil {
				return fmt.Errorf("Failed to insert the Like/Dislike action")
			}

		} else if err != nil {
			return fmt.Errorf("Failed to check if the Like/Dislike action exist")
		}
	}

	if existingAction != action {
		query = "UPDATE posts_interaction SET actions_type = ? WHERE post_id = ? AND user_id = ?"
		if _, err := DB.Exec(query, action, postID, userID); err != nil {
			return fmt.Errorf("Failed to update the Like/Dislike action")
		}
	}
	return nil

}
