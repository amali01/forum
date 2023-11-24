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

function FormatJson(form) {
    var formData = new FormData(form);
    var jsonObject = {};

    formData.forEach((value, key) => {
        jsonObject[key] = value;
    });

    console.log(jsonObject)

    return jsonObject;
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

    fetch("", {
        method: "POST",
        body: JSON.stringify(FormatJson(form))
    }).then(resp => {
        console.log(resp)
    })

}