const formContainer = document.getElementById("FormContainer");

const createPost = async () => {
  let formData = {
    Post: document.getElementById("Pcontent").value,
    Title: document.getElementById("Ptitle").value,
    Categories: document.getElementById("Pcats").value.split(","),
  };
  const response = await fetch("/api/create_post", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  console.log(response);
  let t = await response.text;
  if (t === "OK!") {
    console.log(formData);
    //TODO: FIX THIS
    // location.replace("localhost:8080/");
  } else {
    let errdiv = document.getElementById("errdiv");
    errdiv.innerText = "ERROR CREATING POST";
  }
};
