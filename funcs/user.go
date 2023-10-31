package funcs

import (
	"database/sql"
	"fmt"

	"github.com/mattn/go-sqlite3"
)

func AddUser(userName string, pwd string) error {
	userTypeID, err := UserTypeID("user")
	if err != nil {
		return err
	}
	query := "INSERT INTO users (user_id, user_pwd, user_type) VALUES (?, ?, ?)"
	if _, err := DB.Exec(query, userName, pwd, userTypeID); err != nil {
		sqliteErr, ok := err.(sqlite3.Error)
		if ok && sqliteErr.ExtendedCode == sqlite3.ErrConstraintUnique {
			return fmt.Errorf("user already exist")
		}
		return err
	}
	return nil
}

func UserTypeID(userType string) (int, error) {
	userTypeIDQuery := "SELECT uty_id FROM user_type WHERE user_type = ?"
	var userTypeID int
	if err := DB.QueryRow(userTypeIDQuery, userType).Scan(&userTypeID); err != nil {
		return 0, err
	}
	return userTypeID, nil
}

func SelectUserID(userName, pwd string) (int, error) {
	query := "SELECT u_id FROM users WHERE user_id = ? AND user_pwd = ?"
	row := DB.QueryRow(query, userName, pwd)

	var userID int
	if err := row.Scan(&userID); err != nil {
		if err == sql.ErrNoRows {
			return 0, fmt.Errorf("incorrect UserName / password")
		}
		return 0, err
	}
	return userID, nil
}

func UserToAdmin(userID int) error {
	if UserIsAdmin(userID) {
		return fmt.Errorf("user is already an admin")
	}
	adminTypeID, err := UserTypeID("admin")
	if err != nil {
		return err
	}
	
	query := "UPDATE users SET user_type = ? WHERE u_id = ?"
	if _, err = DB.Exec(query, adminTypeID, userID); err != nil {
		return err
	}
	return nil
}

func UserIsAdmin(userID int) bool {
	query := "SELECT user_type FROM users WHERE u_id = ?"
	var userType int
	if err := DB.QueryRow(query, userID).Scan(&userType); err != nil {
		return false
	}

	adminTypeID, err := UserTypeID("admin")
	if err != nil {
		fmt.Println(err)
		return false
	}
	return userType == adminTypeID
}

// func CreateUserType(userID int, userType string) error {
// 	if !UserIsAdmin(userID) {
// 		return fmt.Errorf("user is not allowed to create a type")
// 	}
// 	query := "INSERT INTO user_type (user_type) VALUES (?)"
// 	if _, err := DB.Exec(query, userType); err != nil {
// 		return err
// 	}
// 	return nil
// }
