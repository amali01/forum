const createPost = async () => {
  event.preventDefault()
  try {
    let formData = {
      Post: document.getElementById("Pcontent").value,
      Title: document.getElementById("Ptitle").value,
    };

    // get selected cats
    let catdiv = document.getElementById('Pcats')
    let maincats = []

    for (let i = 0; i < catdiv.options.length; i++) {
      const element = catdiv.options[i];
      if (element.selected) {
        maincats.push(element.value)
      }
    }


    formData["Categories"] = maincats

    console.log(formData);

    const response = await fetch("/api/create_post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      console.log("Post created successfully");
      window.location.replace("/");
    } else {
      let errdiv = document.getElementById("errdiv");
      errdiv.innerText = "ERROR CREATING POST";
      console.error(
        `Failed to create post. Server returned ${response.status} status.`
      );
    }
  } catch (error) {
    console.error("An error occurred while creating the post:", error);
  }
};
