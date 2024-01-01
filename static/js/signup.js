const errdiv = (msg) => `<div class="signuperr">${msg}</div>`;
// send a followup login request to log the user in
const followupLogin = async (email, pass) => {
  const jsonObject = {
    Email: email,
    Password: pass,
  };

  const jsonString = JSON.stringify(jsonObject);

  fetch("/login", {
    method: "POST",
    body: jsonString,
  })
    .then((response) => {
      if (response.ok) {
        window.location.replace("/");
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
};

// main signup request
const toSignUp = async () => {
  // grab vars
  let uname = document.getElementById("uname").value.trim();
  let email = document.getElementById("email").value.trim();
  let pass = document.getElementById("pass").value;
  let cpass = document.getElementById("cpass").value;

  const form = document.getElementById("signupform");

  // Check for empty or whitespace-only username and email
  if (!uname || !email) {
    form.insertAdjacentHTML("afterbegin", errdiv("Username and email are required."));
    return;
  }

  if (pass !== cpass) {
    form.insertAdjacentHTML("afterbegin", errdiv("Passwords don't match."));
  } else {
    let signUpData = {
      uname: uname,
      email: email,
      password: pass,
    };
    let Res = await fetch("/signup", {
      method: "POST",
      body: JSON.stringify(signUpData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!Res.ok) {
      form.insertAdjacentHTML("afterbegin", errdiv("User creation failed."));
    } else {
      await followupLogin(email, pass);
    }
  }
};
