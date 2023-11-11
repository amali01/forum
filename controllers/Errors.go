package controllers

import (
	"html/template"
	"net/http"
)

type ErrorData struct {
	Err     int
	Message string
	ImageURL string
}

func HTTPErrorHandler(w http.ResponseWriter, r *http.Request, errorCode int) {
	// Get the file name and line number of the function call
	// _, file, line, _ := runtime.Caller(1)
	// fmt.Printf("Error in %s:%d\n", file, line)
	w.WriteHeader(errorCode)
	errdata := ErrorData{Err: errorCode}
	// Set the status code based on the error code
	switch errorCode {
	case 500:
		errdata.Message = "Oh no! Something went wrong on our server. Our team has been alerted."
		errdata.ImageURL = "https://media.tenor.com/Zta7SyV9m24AAAAM/wrong-coffin-dance-bad-coffin-dance.gif"
	case 400:
		errdata.Message = "Bad Request? That's a code red for triggering our bombastic side-eye protocol! Prepare to be side-eyed into oblivion with a look that says, 'Are you serious right now? 👀😒"
		errdata.ImageURL = "https://media.tenor.com/1Eofi87rNokAAAAC/side-eye-seriously.gif"
	case 404:
		errdata.Message = "Uh-oh! It seems we've stumbled upon a parallel pixelverse where this page has gone incognito."
		errdata.ImageURL = "https://media.tenor.com/GdHSY2i9wW0AAAAC/funny-as.gif"
	case 405:
		errdata.Message = "Method Not Allowed"
		errdata.Message = "https://media.tenor.com/HzKjCOw8gekAAAAd/baby-angry.gif"
	default:
		// If the error code is not recognized, return a generic error
		errdata.Message = "Oh no! Something went wrong on our server. Our team has been alerted."
		errdata.ImageURL = "https://media.tenor.com/Zta7SyV9m24AAAAM/wrong-coffin-dance-bad-coffin-dance.gif"
	}

	// Execute the error template with the error data
	tmpl, err := template.ParseFiles("templates/html/error.html")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	err = tmpl.Execute(w, errdata)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
