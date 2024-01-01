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

const loadOptions = async () => {
  const catdiv = document.getElementById("catHandler");
  console.log(catdiv);
  let response = await fetch("/api/categories");
  let data = await response.json();
  console.log(data);
  data.Categories.forEach((cat) => {
    catdiv.innerHTML += `
    <div class="checkoption">
              <label class="checkcontainer">
                <input value="${cat.category}" type="checkbox" />
                <svg width="1em" height="1em" viewBox="0 0 64 64">
                  <path
                    class="path"
                    pathLength="575.0541381835938"
                    d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                  ></path>
                </svg>
              </label>
              <div class="option">${cat.category}</div>
            </div>
    `;
  });
};

const loadPage = () => {
  loadOptions();
  render_nav_bar();
};

// document.addEventListener("load", loadPage, true);
document.addEventListener("DOMContentLoaded", loadPage);

const createPost = async () => {
  event.preventDefault();
  try {
    let formData = {
      Post: document.getElementById("Pcontent").value,
      Title: document.getElementById("Ptitle").value,
    };

    // get selected cats
    let maincats = [];

    // handling cats
    let checkboxes = document.querySelectorAll(
      'input[type="checkbox"]:checked'
    );

    if (checkboxes.length === 0) {
      maincats.push("General");
    } else {
      checkboxes.forEach((checkbox) => {
        maincats.push(checkbox.value);
      });
    }

    formData["Categories"] = maincats;

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
