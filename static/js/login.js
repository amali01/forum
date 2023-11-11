function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();

  // Prepare the data to send to the backend
  var data = {
    id: profile.getId(), // Do not send to your backend! Use an ID token instead.
    name: profile.getName(),
    imageUrl: profile.getImageUrl(),
    email: profile.getEmail(),
  };

  const url = "/auth";

  // Send the POST request using the fetch API
  fetch(url, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Request failed");
      }
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error(error);
    });
}

function sendLoginRequest() {
  const url = "/login";

  // Send the POST request using the fetch API
  fetch(url, {
    method: "POST",
    body: new FormData(document.querySelector("form")),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Request failed");
      }
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error(error);
    });
}
