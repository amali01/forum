// global_vars
let gotten_posts = [];

const isloggedIn = async () => {
  let res = await fetch("/api/islogged");
  let ok = await res.text();
  console.log(ok);
  let isSignedIn;
  if (ok === "1") {
    isSignedIn = "true";
  } else {
    isSignedIn = "false";
  }
  localStorage.setItem("isloggedIn", isSignedIn);
  return isSignedIn;
};

async function evalLogin(fn) {
  let islogged = await isloggedIn();
  if (islogged === "true") {
    fn();
  } else {
    window.location.replace("/login");
  }
}

// App entry
const render_index_page = async () => {
  // Fetch the JSON data from the URL
  fetch("/api/posts")
    .then((response) => response.json())
    .then((data) => {
      // Process the JSON data and create HTML elements
      const jsonContainer =
        document.getElementsByClassName("postcardwrapper")[0];
      console.log(jsonContainer);
      let i = 0;
      data.posts.forEach((post) => {
        gotten_posts.push(post);

        // parse post
        let postElement = post_cards_component(post, i);
        i++;

        jsonContainer.appendChild(postElement);
      });
    })
    .then(() => {
      // Add click listeners
      const likeButtons = document.querySelectorAll(".likeBtn");
      const dislikeButtons = document.querySelectorAll(".dislikeBtn");
      likeButtons.forEach((btn, index) => {
        btn.addEventListener("click", () =>
          evalLogin(() => LikeEvent(index, btn.id.split("_")[1])),
        );
      });

      dislikeButtons.forEach((btn, index) => {
        console.log(index);
        btn.addEventListener("click", () =>
          evalLogin(() => disLikeEvent(index, btn.id.split("_")[1])),
        );
      });
    })
    .catch((error) => console.error("Error fetching JSON:", error));
};

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
  let response = await fetch("/api/category/" + cat);
  let data = await response.json();
  let i = 0;
  data.posts.forEach((post) => {
    if (post.category === null) {
      return;
    } else {
      let postElement = post_cards_component(post, i);
      i++;
      jsonContainer.appendChild(postElement);
    }
  });
};

const filterByUser = async () => {
  const createdByUser = document.getElementById("createdByUser");
  createdByUser.addEventListener("click", () => {
    dispayPostsCards("/api/created_by_user");
  });
  const likedByUser = document.getElementById("likedByUser");
  likedByUser.addEventListener("click", () => {
    dispayPostsCards("/api/liked_by_user");
  });
};

// Fetches post data from the specified JSON file path and displays the posts
const dispayPostsCards = async (path) => {
  const jsonContainer = document.getElementsByClassName("postcardwrapper")[0];
  jsonContainer.innerHTML = ``;
  let response = await fetch(path);
  let data = await response.json();
  let i = 0;
  data.posts.forEach((post) => {
    if (post.category === null) {
      return;
    } else {
      let postElement = post_cards_component(post, i);
      i++;
      jsonContainer.appendChild(postElement);
    }
  });
};
/////////////////////////////////////////////////////////////////////

const LikeEvent = async (index, postID) => {
  let likeBtn = document.querySelectorAll(".likeBtn")[index]; // selects like button
  let dislikeBtn = document.querySelectorAll(".dislikeBtn")[index]; // selects dislike button
  let like_count_area = document.getElementById(`likes_${postID}`); // selects like counts area from dom
  let dislike_count_area = document.getElementById(`dislikes_${postID}`);

  if (gotten_posts[index].isLiked === 1) {
    gotten_posts[index].isLiked = 0;
    likeBtn.classList.remove("liked");
    likeBtn.innerHTML =
      '<img src="static/assets/icons8-accept-30.png" alt="Like">';
    await sendReqPost(postID, 0);
  } else {
    gotten_posts[index].isLiked = 1;
    likeBtn.classList.add("liked");
    likeBtn.innerHTML =
      '<img src="static/assets/icons8-accept-30(1).png" alt="Like">';

    await sendReqPost(postID, 1);
  }

  if (dislikeBtn.classList.contains("disliked")) {
    dislikeBtn.classList.remove("disliked");
    dislikeBtn.innerHTML =
      '<img src="static/assets/icons8-dislike-30.png" alt="Dislike">';
  }
  /* fetch new like and dislike count and update the DOM */
  await get_like_dislike_count(postID).then((likes_dislikes) => {
    like_count_area.innerHTML = likes_dislikes.interactions.like_count;
    dislike_count_area.innerHTML = likes_dislikes.interactions.dislike_count;
  });
};

const disLikeEvent = async (index, postID) => {
  let likeBtn = document.querySelectorAll(".likeBtn")[index]; // selects like button
  let dislikeBtn = document.querySelectorAll(".dislikeBtn")[index]; // selects dislike button
  let like_count_area = document.getElementById(`likes_${postID}`); // selects like counts area from dom
  let dislike_count_area = document.getElementById(`dislikes_${postID}`);

  if (gotten_posts[index].isLiked === -1) {
    gotten_posts[index].isLiked = 0;
    dislikeBtn.classList.remove("disliked");
    dislikeBtn.innerHTML =
      '<img src="static/assets/icons8-dislike-30.png" alt="Dislike">';
    await sendReqPost(postID, 0);
  } else {
    gotten_posts[index].isLiked = -1;
    dislikeBtn.classList.add("disliked");
    dislikeBtn.innerHTML =
      '<img src="static/assets/icons8-dislike-30(1).png" alt="Dislike">';

    await sendReqPost(postID, -1);
  }

  if (likeBtn.classList.contains("liked")) {
    likeBtn.classList.remove("liked");
    likeBtn.innerHTML =
      '<img src="static/assets/icons8-accept-30.png" alt="Like">';
  }
  /* fetch new like and dislike count and update the DOM */
  await get_like_dislike_count(postID).then((likes_dislikes) => {
    like_count_area.innerHTML = likes_dislikes.interactions.like_count;
    dislike_count_area.innerHTML = likes_dislikes.interactions.dislike_count;
  });
};

const get_like_dislike_count = async (postID) => {
  let interactions_obj = {};
  await fetch("/api/postlikes", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      post_id: postID,
    },
  })
    .then((resp) => {
      return resp.json();
    })
    .then((data) => {
      interactions_obj = data;
    });

  return interactions_obj;
};

const sendReqPost = async (PostID, LikeDislike) => {
  await fetch("/api/likes_post", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      PostID: parseInt(PostID, 10),
      LikeDislike,
    }),
  });
};

/* Postcard component loader
 * inputs:
 *          post: post object
 *          i: index of post in the html page*/
const post_cards_component = (post, i) => {
  //parse cats
  let cats = ``;
  if (post.category === null) {
    cats += `<div class="category">null</div>`;
  } else {
    post.category.forEach((cat) => {
      cats += `<div class="category">${cat}</div>`;
    });
  }
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
                              <p>Creation Date: ${post.creation_date}</p>
                          </div>
                      </div>
                  </div>
                    <div id="likeBtn_${post.post_id}" class="likeBtn ${
                      post.isLiked === 1 ? "liked" : ""
                    }" >
                      <img src="${
                        post.isLiked === 1
                          ? "static/assets/icons8-accept-30(1).png"
                          : "static/assets/icons8-accept-30.png"
                      }" alt="Like">
                    </div>
              <!-- Show like counts -->
              <div id="likes_${post.post_id}">
                    ${post.post_likes}
              </div>
                    <div id="dislikeBtn_${post.post_id}" class="dislikeBtn ${
                      post.isLiked === -1 ? "disliked" : ""
                    }" >
                        <img src="${
                          post.isLiked === -1
                            ? "static/assets/icons8-dislike-30(1).png"
                            : "static/assets/icons8-dislike-30.png"
                        }" alt="Dislike">
                    </div>
              <!-- Show like counts -->
              <div id="dislikes_${post.post_id}">
                    ${post.post_dislikes}
              </div>
              </div>
          </div>
          `;

  return postElement;
};

/************* App entry point *************/
// Attach the function to the load event

async function initPages() {
  await loadCats();
  await filterByUser();
  // await render_nav_bar();
  //  isloggedIn();
  await render_index_page();
}

// window.addEventListener("load", initPages, true);
window.addEventListener("DOMContentLoaded", initPages);
/************* END *************/
