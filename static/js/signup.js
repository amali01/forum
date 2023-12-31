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
  let uname = document.getElementById("uname");
  let email = document.getElementById("email");
  let pass = document.getElementById("pass");
  let cpass = document.getElementById("cpass");

  const form = document.getElementById("signupform");

  if (pass.value !== cpass.value) {
    form.insertAdjacentHTML("afterbegin", errdiv("PASSWORDS DON'T MATCH"));
  } else {
    let signUpData = {
      uname: uname.value,
      email: email.value,
      password: pass.value,
    };
    let Res = await fetch("/signup", {
      method: "POST",
      body: JSON.stringify(signUpData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!Res.ok) {
      form.insertAdjacentHTML("afterbegin", errdiv("USER CREATION FAILED"));
    } else {
      await followupLogin(email.value, pass.value);
    }
  }
};
