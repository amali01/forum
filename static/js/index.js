// App entry
const render_index_page = () => {
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
                          <a class="title bold_text" href='/post/${post.post_id
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
                    <div class="likeBtn ${post.isLiked === 1 ? 'liked' : ''}" onclick="LikeEvent(${i}, ${post.post_id})">
                      <img src="${post.isLiked === 1 ? 'static/assets/icons8-accept-30(1).png' : 'static/assets/icons8-accept-30.png'}" alt="Like">
                      ${post.isLiked}
                    </div>
                    ${post.post_likes}
                    <div class="dislikeBtn ${post.isLiked === -1 ? 'disliked' : ''}" onclick="disLikeEvent(${i}, ${post.post_id})">
                        <img src="${post.isLiked === -1 ? 'static/assets/icons8-dislike-30(1).png' : 'static/assets/icons8-dislike-30.png'}" alt="Dislike">
                    </div>
                    ${post.post_dislikes}
              </div>
          </div>
              `;
        i++;

        jsonContainer.appendChild(postElement);
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
  let cats = ``;
  data.posts.forEach((post) => {
    if (post.category === null) {
      return;
    } else {
      post.category.forEach((cat) => {
        cats += `<div class="category">${cat}</div>`;
      });
    }
    console.log("TRUE");
    let postElement = document.createElement("div");

    postElement.className = "postcard";
    postElement.innerHTML = `
      <div class="postWrapper">
          <!-- <div class="postImage"></div> -->
          <div class="dataWrapper">
              <div class="data">
                  <div class="title_category">
                      <a class="title bold_text" href='/post/${post.post_id
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
                <div class="likeBtn" onclick="LikeEvent(${i}, ${post.post_id})">
                  <img src="${post.isLiked === 1 ? 'static/assets/icons8-accept-30(1).png' : 'static/assets/icons8-accept-30.png'}" alt="Like">
                  ${post.isLiked}
                </div>
                ${post.post_likes}
                <div class="dislikeBtn" onclick="disLikeEvent(${i}, ${post.post_id})">
                    <img src="${post.isLiked === -1 ? 'static/assets/icons8-dislike-30(1).png' : 'static/assets/icons8-dislike-30.png'}" alt="Dislike">
                </div>
                ${post.post_dislikes}
          </div>
      </div>
          `;
    i++;
    cats = ``

    // // Add "liked" class to likeBtn if post is liked
    // const likeBtn = postElement.querySelector('.likeBtn')[i];
    // const dislikeBtn = postElement.querySelector('.dislikeBtn')[i];

    // if (post.isLiked === 1) {
    //   likeBtn.classList.add('liked');
    // } else if (post.isLiked === -1) {
    //   dislikeBtn.classList.add('disliked');
    // }

    jsonContainer.appendChild(postElement);

  });
};

/////////////////////////////////////////////////////////////////////

const LikeEvent = async (index, postID) => {
  let likeBtn = document.querySelectorAll(".likeBtn")[index];
  let dislikeBtn = document.querySelectorAll(".dislikeBtn")[index];
  if (likeBtn.classList.contains("liked")) {
    likeBtn.classList.remove("liked");
    likeBtn.innerHTML = '<img src="static/assets/icons8-accept-30.png" alt="Like">';
    await sendReqPost(postID, 0);
  } else {
    likeBtn.classList.add("liked");

    if (dislikeBtn.classList.contains("disliked")) {
      dislikeBtn.classList.remove("disliked");
      dislikeBtn.innerHTML = '<img src="static/assets/icons8-dislike-30.png" alt="Dislike">';
    }

    likeBtn.innerHTML = '<img src="static/assets/icons8-accept-30(1).png" alt="Like">';
    await sendReqPost(postID, 1);
  }
};

const disLikeEvent = async (index, postID) => {
  let likeBtn = document.querySelectorAll(".likeBtn")[index];
  let dislikeBtn = document.querySelectorAll(".dislikeBtn")[index];
  if (dislikeBtn.classList.contains("disliked")) {
    dislikeBtn.classList.remove("disliked");
    dislikeBtn.innerHTML = '<img src="static/assets/icons8-dislike-30.png" alt="Dislike"> ';
    await sendReqPost(postID, 0);
  } else {
    dislikeBtn.classList.add("disliked");
    if (likeBtn.classList.contains("liked")) {
      likeBtn.classList.remove("liked");
      likeBtn.innerHTML = '<img src="static/assets/icons8-accept-30.png" alt="Like">';
    }
    dislikeBtn.innerHTML = '<img src="static/assets/icons8-dislike-30(1).png" alt="Dislike">';
    await sendReqPost(postID, -1);
  }
};

const sendReqPost = async (postID, likeDislike) => {
  await fetch("/api/likes_post", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      postID,
      likeDislike,
    }),
  });
};

// App entry point
// Attach the function to the load event
window.addEventListener("load", render_index_page);
