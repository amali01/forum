const formContainer = document.getElementById("FormContainer");

const createPost = async () => {
  let formData = {
    postTitle: document.getElementById("Ptitle").value,
    postCats: document.getElementById("Pcats").value.split(","),
    postContent: document.getElementById("Pcontent").value,
  };
  const response = await fetch("/api/create_post", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  if (response.ok) {
    location.href('/')
  } else {
    let errdiv = document.getElementById('errdiv')
    errdiv.innerText = "ERROR CREATING POST";
  }
};
