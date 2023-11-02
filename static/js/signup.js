
function sendsignupreq() {
  const url = "/signup";
  let formData = new FormData(document.querySelector("form"))

  // Convert form data to JSON object
  const jsonObject = {};
  formData.forEach((value, key) => {
    jsonObject[key] = value;
  });

  // Convert the JSON object to a JSON string
  const jsonString = JSON.stringify(jsonObject);
  console.log(jsonString)
  // Send the POST request using the fetch API
  fetch(url, {
    method: "POST",
    body: jsonString,
  }).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Request failed");
    }
  }).then((data) => {
    console.log(data);
  }).catch((error) => {
    console.error(error);
  });
}
