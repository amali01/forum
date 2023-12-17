package controllers

import (
	"database/sql"
	"forum/pkgs/funcs"
	"html/template"
	"net/http"
	"strings"
)

// Category page Handler
func RenderCategoryPage(w http.ResponseWriter, r *http.Request, data *sql.DB) {
	// Check if the request is not GET && NOT POST requests
	if r.Method != "GET" {
		HTTPErrorHandler(w, r, http.StatusMethodNotAllowed)
		return
	}

	categoryName := strings.TrimPrefix(r.URL.Path, "/category/")
	_, err := funcs.GetCategoryID(categoryName)
	if err != nil {
		http.Error(w, "This Category do not exist", http.StatusBadRequest)
		return
	}
	/////////////////////////////////////////////////////////////////////////////////////////
	files := []string{
		"/static/html/index.html", // need to creat a category page
	}

	tmpl, err := template.ParseFiles(files...)
	if err != nil {
		HTTPErrorHandler(w, r, http.StatusInternalServerError)
		return
	}

	if err := tmpl.Execute(w, data); err != nil {
		HTTPErrorHandler(w, r, http.StatusInternalServerError)
		return
	}
}
