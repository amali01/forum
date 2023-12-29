const render_nav_bar = async () => {
  let nav = ``;
  let islogged = localStorage.getItem("isloggedIn");
  if (islogged) {
    nav += `
      <nav>
        <a href="/">
          <div class="logo">Re4um</div>
        </a>
        <ul class="actionitems">
          <li>
            <a href="/create_post">
              <img
                src="/static/assets/plus-large-svgrepo-com.svg"
                alt="add Icon"
                class="navicon"
                title="Create Post"
              />
            </a>
          </li>
          <li>
            <img
              src="/static/assets/information-circle-svgrepo-com.svg"
              alt="about Page Icon"
              class="navicon"
              title="About"
            />
          </li>
          <li>
            <img
              src="/static/assets/API.svg"
              alt="API Icon"
              class="navicon"
              title="API documentation"
            />
          </li>
          <li>
            <img
              src="/static/assets/HomeIcon.svg"
              alt="HomeIcon"
              class="navicon"
              title="Back To Homepage"
              onclick="location.href('/')"
            />
          </li>
          <li>
            <img
              src="/static/assets/REgallery.svg"
              alt="ReGallery (SOON!)"
              class="navicon"
              title="Regallery (SOON!)"
            />
          </li>
          <li>
            <img
              src="/static/assets/chat.svg"
              alt="chatIcon"
              class="navicon"
              title="chat (SOON)"
            />
          </li>
        </ul>
        <div>
          <a href="/logout">
            <button class="profile" id="profileBtn">
              Sign Out
            </button>
          </a>
        </div>
      </nav>
    `;
  } else {
    nav += `
      <nav>
        <a href="/">
          <div class="logo">Re4um</div>
        </a>
        <ul class="actionitems">
          <li>
            <a href="/create_post">
              <img
                src="/static/assets/plus-large-svgrepo-com.svg"
                alt="add Icon"
                class="navicon"
                title="Create Post"
              />
            </a>
          </li>
          <li>
            <img
              src="/static/assets/information-circle-svgrepo-com.svg"
              alt="about Page Icon"
              class="navicon"
              title="About"
            />
          </li>
          <li>
            <img
              src="/static/assets/API.svg"
              alt="API Icon"
              class="navicon"
              title="API documentation"
            />
          </li>
          <li>
            <img
              src="/static/assets/HomeIcon.svg"
              alt="HomeIcon"
              class="navicon"
              title="Back To Homepage"
              onclick="location.href('/')"
            />
          </li>
          <li>
            <img
              src="/static/assets/REgallery.svg"
              alt="ReGallery (SOON!)"
              class="navicon"
              title="Regallery (SOON!)"
            />
          </li>
          <li>
            <img
              src="/static/assets/chat.svg"
              alt="chatIcon"
              class="navicon"
              title="chat (SOON)"
            />
          </li>
        </ul>
        <div>
          <a href="/login">
            <button class="profile" id="profileBtn">
              Sign In
            </button>
          </a>
          <a href="/signup">
            <button class="profile" id="profileBtn">
              Sign Up
            </button>
          </a>
        </div>
      </nav>
    `;
  }
  let body = document.body;
  body.insertAdjacentHTML("beforebegin", nav);
};

document.addEventListener('load', render_nav_bar(), true)

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
