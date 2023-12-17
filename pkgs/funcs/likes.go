package funcs

import (
	"database/sql"
	"fmt"
)

func PostLikes(userID int, postID int, action int) error {
	var postExists bool
	// Checking if the post ID exists in the database
	query := "SELECT EXISTS (SELECT 1 FROM posts WHERE p_id = ?)"
	if err := DB.QueryRow(query, postID).Scan(&postExists); err != nil {
		return err
	}
	if !postExists {
		return fmt.Errorf("post does not exist")
	}

	//////////////////////////////////////////////////////////////////
	var existingAction bool
	var toDo bool
	if action == 0 {
		// Checking if there is already an action (like/dislike) on the post by the same user
		query = "SELECT actions_type FROM posts_interaction WHERE post_id = ? AND user_id = ?"
		if err := DB.QueryRow(query, postID, userID).Scan(&existingAction); err != nil {
			if err == sql.ErrNoRows {
				return nil
			} else if err != nil {
				return fmt.Errorf("failed to check if the Like/Dislike action exist")
			}
		}
		// Remove the action (like/dislike) data into from the database
		query = "UPDATE posts_interaction SET actions_type = ? WHERE post_id = ? AND user_id = ?"
		if _, err := DB.Exec(query, nil, postID, userID); err != nil {
			return fmt.Errorf("failed to update the Like/Dislike action")
		}

	} else {
		if action == 1 {
			toDo = true
		} else if action == -1 {
			toDo = false
		}
		// Checking if there is already an action (like/dislike) on the post by the same user
		query = "SELECT actions_type FROM posts_interaction WHERE post_id = ? AND user_id = ?"
		if err := DB.QueryRow(query, postID, userID).Scan(&existingAction); err != nil {
			if err == sql.ErrNoRows {
				// Inserting the action (like/dislike) data into the database
				query = "INSERT INTO posts_interaction (post_id, user_id, actions_type) VALUES (?, ?, ?)"
				if _, err := DB.Exec(query, postID, userID, toDo); err != nil {
					return fmt.Errorf("failed to insert the Like/Dislike action")
				}

			} else if err != nil {
				return fmt.Errorf("failed to check if the Like/Dislike action exist")
			}
		}

		if existingAction != toDo {
			query = "UPDATE posts_interaction SET actions_type = ? WHERE post_id = ? AND user_id = ?"
			if _, err := DB.Exec(query, action, postID, toDo); err != nil {
				return fmt.Errorf("failed to update the Like/Dislike action")
			}
		}
		return nil
	}
	return nil
}

func CommentLikes(userID int, commentID int, action int) error {
	var commentExists bool
	// Checking if the post ID exists in the database
	query := "SELECT EXISTS (SELECT 1 FROM comments WHERE comm_id = ?)"
	if err := DB.QueryRow(query, commentID).Scan(&commentExists); err != nil {
		return err
	}
	if !commentExists {
		return fmt.Errorf("comment does not exist")
	}

	//////////////////////////////////////////////////////////////////

	var existingAction bool
	var toDo bool
	if action == 0 {
		// Checking if there is already an action (like/dislike) on the comment by the same user
		query = "SELECT actions_type FROM comments_interactions WHERE comment_id = ? AND user_id = ?"
		if err := DB.QueryRow(query, commentID, userID).Scan(&existingAction); err != nil {
			if err == sql.ErrNoRows {
				return nil
			} else if err != nil {
				return fmt.Errorf("failed to check if the Like/Dislike action exist")
			}
		}

		// Remove the action (like/dislike) data into from the database
		query = "UPDATE comments_interactions SET actions_type = ? WHERE comment_id = ? AND user_id = ?"
		if _, err := DB.Exec(query, nil, commentID, userID); err != nil {
			return fmt.Errorf("failed to update the Like/Dislike action")
		}

	} else {
		if action == 1 {
			toDo = true
		} else if action == -1 {
			toDo = false
		}

		// Checking if there is already an action (like/dislike) on the comment by the same user
		query = "SELECT actions_type FROM comments_interactions WHERE comment_id = ? AND user_id = ?"
		if err := DB.QueryRow(query, commentID, userID).Scan(&existingAction); err != nil {
			if err == sql.ErrNoRows {
				// Inserting the action (like/dislike) into the database
				query = "INSERT INTO comments_interactions (comment_id, user_id, actions_type) VALUES (?, ?, ?)"
				if _, err := DB.Exec(query, commentID, userID, toDo); err != nil {
					return fmt.Errorf("failed to insert the Like/Dislike action")
				}

			} else if err != nil {
				return fmt.Errorf("failed to check if the Like/Dislike action exist")
			}
		}

		if existingAction != toDo {
			query = "UPDATE comments_interactions SET actions_type = ? WHERE comment_id = ? AND user_id = ?"
			if _, err := DB.Exec(query, toDo, commentID, userID); err != nil {
				return fmt.Errorf("failed to update the Like/Dislike action")
			}
		}
	}
	return nil

}

type LikeCounts struct {
	LikeCount    int
	DislikeCount int
}

func CountPostLikes(postID int) (LikeCounts, error) {
	var postExists bool
	// Checking if the post ID exists in the database
	query := "SELECT EXISTS (SELECT 1 FROM posts WHERE p_id = ?)"
	if err := DB.QueryRow(query, postID).Scan(&postExists); err != nil {
		return LikeCounts{}, err
	}
	if !postExists {
		return LikeCounts{}, fmt.Errorf("post does not exist")
	}

	//////////////////////////////////////////////////////////////////

	var counts LikeCounts

	query = "SELECT actions_type, COUNT(*) as count FROM posts_interaction WHERE post_id = ? GROUP BY actions_type;"
	rows, err := DB.Query(query, postID)
	if err != nil {
		return LikeCounts{}, err
	}
	defer rows.Close()

	for rows.Next() {
		var actionType bool
		var count int
		if err := rows.Scan(&actionType, &count); err != nil {
			return LikeCounts{}, err
		}
		if actionType {
			counts.LikeCount = count
		} else {
			counts.DislikeCount = count
		}
	}

	return counts, nil
}

func CountCommentLikes(commentID int) (LikeCounts, error) {

	var commentExists bool
	// Checking if the post ID exists in the database
	query := "SELECT EXISTS (SELECT 1 FROM comments WHERE comm_id = ?)"
	if err := DB.QueryRow(query, commentID).Scan(&commentExists); err != nil {
		return LikeCounts{}, err
	}
	if !commentExists {
		return LikeCounts{}, fmt.Errorf("comment does not exist")
	}

	//////////////////////////////////////////////////////////////////

	var counts LikeCounts

	query = "SELECT actions_type, COUNT(*) as count FROM comments_interactions WHERE comment_id = ? GROUP BY actions_type;"
	rows, err := DB.Query(query, commentID)
	if err != nil {
		return LikeCounts{}, err
	}

	defer rows.Close()

	for rows.Next() {
		var actionType bool
		var count int
		if err := rows.Scan(&actionType, &count); err != nil {
			return LikeCounts{}, err
		}
		if actionType {
			counts.LikeCount = count
		} else {
			counts.DislikeCount = count
		}
	}

	return counts, nil
}
