function logVars(form) {
    var formValues = {}
    for (var i = 0; i < form.elements.length; i++) {
        var input = form.elements[i];
        if (input.tagName === "INPUT") { // Check if the element is an input
            console.log(input.value)
            formValues[input.name] = input.value;
        }
    }
}

function checkPassEqual() {
    let pass = document.getElementsByName("password")[0].value
    let cpass = document.getElementsByName("cpassword")[0].value

    return pass === cpass
}

function FormatJson(form) {
    var formData = new FormData(form);
    var json = {};

    for (var pair of formData.entries()) {
        json[pair[0]] = pair[1];
    }

    console.log(json)

    return json;
}

function CorrespondDB() {
    //! DEPRECATED: event class is deprecated, ensure to replace in
    //! Later iterations of this project
    event.preventDefault()
    let form = document.getElementById("loginform")
    //* log the variables in the terminal
    logVars(form)
    //* use fetch API to submit request to login
    console.log()
    if (checkPassEqual) {
        fetch("/login", {
            method: "POST",
            body: FormatJson(form)
        })
    }
}