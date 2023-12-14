// Fetch the JSON data from the URL
fetch("/api/posts")
  .then((response) => response.json())
  .then((data) => {
    // Process the JSON data and create HTML elements
    const jsonContainer = document.getElementsByClassName("postcardwrapper")[0];
    console.log(jsonContainer);
    let i = 0;
    data.posts.forEach((post) => {
      const postElement = document.createElement("div");
      postElement.className = "postcard";
      postElement.innerHTML = `
        <div class="postWrapper">
            <div class="postImage"></div>
            <div class="dataWrapper">
                <div class="data">
                    <div class="title_category">
                        <a class="title bold_text" href='/post/${post.post_id}' target=_blank>${post.title}</a>    
                        <div class="categories">
                            <div class="category">
                                ${post.category}
                            </div>
                        </div>
                    </div>
                    <div class="user">
                        <div class="userID">User ID: ${post.user_id}</div>
                        <div class="action">
                            <p>Creation Date: ${post.creation_date}</p>
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

const sendReq = async (num) => {
  fetch("/likes_post", {
    method: "POST",
    body: num,
  });
};
