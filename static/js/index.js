// Fetch the JSON data from the URL
fetch("/api/posts")
  .then((response) => response.json())
  .then((data) => {
    // Process the JSON data and create HTML elements
    const jsonContainer = document.getElementsByClassName("postcardwrapper")[0];
    console.log(jsonContainer);
    let i = 0;
    data.posts.forEach((post) => {
      //parse cats
      let cats = ``;
      if (post.category === null) {
        cats += `<div class="category">null</div>`;
      } else {
        post.category.forEach((cat) => {
          cats += `<div class="category">${cat}</div>`;
        });
      }

      // parse post
      const postElement = document.createElement("div");
      postElement.className = "postcard";
      postElement.innerHTML = `
        <div class="postWrapper">
            <!-- <div class="postImage"></div> -->
            <div class="dataWrapper">
                <div class="data">
                    <div class="title_category">
                        <a class="title bold_text" href='/post/${
                          post.post_id
                        }'>${post.title}</a>    
                        <div class="categories">
                              ${cats}
                        </div>
                    </div>
                    <div class="user">
                        <div class="userID">by ${post.user_name}</div>
                        <div class="action">
                            <p>Creation Date: ${new Date(
                              post.creation_date
                            )}</p>
                        </div>
                    </div>
                </div>
                <div class="likeBtn" onclick="LikeEvent(${i})">🤍</div>
                <div class="dislikeBtn" onclick="disLikeEvent(${i})">👎🏻</div>
            </div>
        </div>
            `;
      i++;
      jsonContainer.appendChild(postElement);
    });
  })
  .catch((error) => console.error("Error fetching JSON:", error));

function LikeEvent(index) {
  let likeBtn = document.querySelectorAll(".likeBtn")[index];
  let dislikeBtn = document.querySelectorAll(".dislikeBtn")[index];
  if (likeBtn.classList.contains("liked")) {
    likeBtn.classList.remove("liked");
    likeBtn.textContent = "🤍";
    sendReq(-1);
  } else {
    likeBtn.classList.add("liked");
    if (dislikeBtn.classList.contains("disliked")) {
      dislikeBtn.classList.remove("disliked");
      dislikeBtn.textContent = "👎🏻";
    }
    likeBtn.textContent = "❤️";
    sendReq(1);
  }
}

function disLikeEvent(index) {
  let likeBtn = document.querySelectorAll(".likeBtn")[index];
  let dislikeBtn = document.querySelectorAll(".dislikeBtn")[index];
  if (dislikeBtn.classList.contains("disliked")) {
    dislikeBtn.classList.remove("disliked");
    dislikeBtn.textContent = "👎🏻";
    sendReq(1);
  } else {
    dislikeBtn.classList.add("disliked");
    if (likeBtn.classList.contains("liked")) {
      likeBtn.classList.remove("liked");
      likeBtn.textContent = "🤍";
    }
    dislikeBtn.textContent = "👎🏿";
    sendReq(-1);
  }
}

const loadCats = async () => {
  const catwrapper = document.getElementById("allcats");
  let response = await fetch("/api/categories");
  let data = await response.json();
  data.Categories.forEach((cat) => {
    let child = document.createElement("div");
    child.classList.add("catlisting");
    child.id = `catlisting-${cat.category}`;
    child.addEventListener("click", () => {
      filterToCat(cat.category);
    });
    child.innerText = cat.category;
    catwrapper.append(child);
  });
};

const filterToCat = async (cat) => {
  const jsonContainer = document.getElementsByClassName("postcardwrapper")[0];
  jsonContainer.innerHTML = ``;
  let response = await fetch("/api/posts");
  let data = await response.json();
  let i = 0;
  let cats = ``;
  data.posts.forEach((post) => {
    if (post.category === null) {
      return;
    } else {
      post.category.forEach((cat) => {
        cats += `<div class="category">${cat}</div>`;
      });
    }
    if (post.category.includes(cat)) {
      console.log("TRUE");
      let postElement = document.createElement("div");
      postElement.className = "postcard";
      postElement.innerHTML = `
        <div class="postWrapper">
            <!-- <div class="postImage"></div> -->
            <div class="dataWrapper">
                <div class="data">
                    <div class="title_category">
                        <a class="title bold_text" href='/post/${
                          post.post_id
                        }'>${post.title}</a>    
                        <div class="categories">
                            ${cats}
                        </div>
                    </div>
                    <div class="user">
                        <div class="userID">by ${post.user_name}</div>
                        <div class="action">
                            <p>Creation Date: ${new Date(
                              post.creation_date
                            )}</p>
                        </div>
                    </div>
                </div>
                <div class="likeBtn" onclick="LikeEvent(${i})">🤍</div>
                <div class="dislikeBtn" onclick="disLikeEvent(${i})">👎🏻</div>
            </div>
        </div>
            `;
      i++;
      cats = ``
      jsonContainer.appendChild(postElement);
    }
  });
};

const sendReq = async (num) => {
  fetch("/likes_post", {
    method: "POST",
    body: num,
  });
};
