package funcs

import (
	"database/sql"
	"log"
	"os"
)

const DBPath string = "../forum.db"

var DB *sql.DB

func Init() {
	// connect to the database
	_, err := os.Stat(DBPath)
	if os.IsNotExist(err) {
		log.Fatal("Database file does not exist.")
	}
	DB, err = sql.Open("sqlite3", DBPath)
	if err != nil {
		log.Fatal(err)
	}
}
