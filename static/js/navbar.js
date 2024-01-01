const isloggedInNav = async () => {
    let res = await fetch("/api/islogged");
    let ok = await res.text();
    console.log(ok);
    let isSignedIn;
    if (ok === "1") {
      isSignedIn = "true";
    } else {
      isSignedIn = "false";
    }
    localStorage.setItem("isloggedInNav", isSignedIn);
    return isSignedIn;
  };
  
//   async function evalLogin(fn) {
//     let islogged = await isloggedInNav();
//     if (islogged === "true") {
//       fn();
//     } else {
//       window.location.replace("/login");
//     }
//   }
  
  const render_nav_bar = async () => {
    let nav = ``;
    let isloggedNav = await isloggedInNav();
    if (isloggedNav === "true") {
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
              <a href="/login">
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

  window.addEventListener("load", render_nav_bar, true);
