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
  let unameInput = document.getElementById("uname");
  let emailInput = document.getElementById("email");
  let pass = document.getElementById("pass").value;
  let cpass = document.getElementById("cpass").value;

  const form = document.getElementById("signupform");

  // Check for empty or whitespace-only username and email
  if (!unameInput.value.trim() || !emailInput.value.trim()) {
    form.insertAdjacentHTML(
      "afterbegin",
      errdiv("Username and email are required.")
    );
    return;
  }

  // Limit the length of the username and provide feedback
  let uname = unameInput.value.trim();
  if (uname.length > 20) {
    form.insertAdjacentHTML(
      "afterbegin",
      errdiv("Username exceeds 20 characters. You can edit it.")
    );
    return; // Stop execution if a warning is displayed
  }

  // Limit the length of the email and provide feedback
  let email = emailInput.value.trim();
  if (email.length > 30) {
    form.insertAdjacentHTML(
      "afterbegin",
      errdiv("Email exceeds 30 characters. You can edit it.")
    );
    return; // Stop execution if a warning is displayed
  }

  // Limit the length of the password and provide feedback
  if (pass.length > 50) {
    form.insertAdjacentHTML(
      "afterbegin",
      errdiv("Password exceeds 50 characters. You can edit it.")
    );
    return; // Stop execution if a warning is displayed
  }

  if (pass !== cpass) {
    form.insertAdjacentHTML("afterbegin", errdiv("Passwords don't match."));
  } else {
    let signUpData = {
      name: uname,
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
      const errorText = await Res.text();
      form.insertAdjacentHTML("afterbegin", errdiv(errorText));
    } else {
      await followupLogin(email, pass);
    }
  }
};
