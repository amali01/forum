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
        if (pair[0] == "cpassword") {
            continue
        } else {
            json[pair[0]] = pair[1];
        }

    }

    console.log(json)

    return json;
}

function AddToDB() {
    //! DEPRECATED: event
    event.preventDefault()
    let form = document.getElementById("signupform")
    //* log the variables in the terminal
    logVars(form)
    //* use fetch API to submit request to add
    console.log()
    if (checkPassEqual) {
        fetch("/signup", {
            method: "POST",
            body: FormatJson(form)
        })
    }
}