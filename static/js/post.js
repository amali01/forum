const postwrapper = document.getElementById("mPostWrapper");
const postID = parseInt(
  location.href.match(/post\/[0-9]+/)[0].replace("post/", ""),
);
console.log(postID);

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

const loadNav = () => {
  let nav = ``;
  let islogged = localStorage.getItem("isloggedIn");
  if (islogged === "true") {
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

const readyPost = async () => {
  let Response = await fetch(`/api/post/${postID}`);
  if (!Response.ok) {
    console.log("ERROR FETCHING DATA");
  }
  let postData = await Response.json();

  await orgPostHTML(postwrapper, postData);
};

// function to add post divs to post wrapper
/*
 * inputs:
 *    prop: json object, in this case it is post object
 *    wrapper: is the html tag that holds the rendered infrormations
 *    */

const orgPostHTML = async (wrapper, prop) => {
  let cats = ``;

  console.log(prop);

  console.log(prop.category);
  prop.category.forEach((cat) => {
    console.log(cat);
    cats += `<div class="category">${cat}</div>`;
  });

  let comments = await orgComments();

  wrapper.innerHTML += `
            <div class="profilestuff">
                <div class="pfpImage">
                    <img src="../../static/assets/reddit.png" alt="reddit lol" class="pimg">
                </div>
                <div class="profileinfo">
                    <div class="profileName">${prop.user_name}</div>
                    <div class="postinfo">
                        <div class="postDate">${prop.creation_date}</div>
                        <div class="commentsLink">comments</div>
                          <div class="likeBtn" onclick="evalLogin(LikeEvent(0, ${postID}, 'post', 1))">
                             <img src="../../static/assets/icons8-accept-30.png" alt="like Heart">
                          </div>
                          ${prop.post_likes}
                          <div class="dislikeBtn" onclick="evalLogin(disLikeEvent(0, ${postID}, 'post', -1))">
                              <img src="../../static/assets/icons8-dislike-30.png" alt="dislike Heart">
                          </div>
                          ${prop.post_dislikes}
                    </div>
                </div>
            </div>
            <div class="posttitle">${prop.title}</div>
            <div class="postcats">
                ${cats}
            </div>
            <div class="postcontent">
            ${prop.text}
            </div>
            <hr>
            <div class="commentAnnounce">
                        Comments
                    </div>
            <div class="postcomments">
                <div class="comment">
                    ${comments}
                </div>
            </div>
          </div>
        `;
};

const orgComments = async () => {
  let comdiv = ``;
  let Response = await fetch("/api/comments", {
    method: "POST",
    body: `
        {
            "post_id" : ${postID}
        }
        `,
  });

  let commentArray = await Response.json();
  let i = 1;
  commentArray.comments.forEach((com) => {
    comdiv += `<div class="scomment">
                        <div class="nameandlogo">
                            <div class="pfpImage">
                                <img src="../../static/assets/reddit.png" alt="reddit lol" class="pimg">
                            </div>
                            <div class="profileName">${com.user_name}</div>
                            <div class="commentDate">${com.creation_date}</div>
                        </div>
                        <div class="commenttext">
                            ${com.comment}
                        </div>
                        <div class="commentInfo">
                            <div class="comlikesdislikes">
                              <div class="likeBtn" onclick="evalLogin(LikeEvent(${i}, ${com.comment_id}, 'comm', 1))">
                                <img src="../../static/assets/icons8-accept-30.png" alt="like Heart">
                              </div>
                              ${com.comment_likes}
                              <div class="dislikeBtn" onclick="evalLogin(disLikeEvent(${i}, ${com.comment_id}, 'comm', -1))">
                                <img src="../../static/assets/icons8-dislike-30.png" alt="dislike Heart">
                              </div>
                              ${com.comment_dislikes}
                        </div>
                        </div>
                    </div>
                    

                    `;
    i++;
  });
  return comdiv;
};

function LikeEvent(index, ID, type, like) {
  let likeBtn = document.querySelectorAll(".likeBtn")[index];
  let dislikeBtn = document.querySelectorAll(".dislikeBtn")[index];

  if (likeBtn.classList.contains("liked")) {
    likeBtn.classList.remove("liked");
    likeBtn.innerHTML =
      '<img src="../../static/assets/icons8-accept-30.png" alt="Like">';
    if (type === "post") {
      sendReqPost(ID, 0);
    } else if (type === "comm") {
      sendReqComment(ID, 0);
    }
  } else {
    likeBtn.classList.add("liked");

    if (dislikeBtn.classList.contains("disliked")) {
      dislikeBtn.classList.remove("disliked");
      dislikeBtn.innerHTML =
        '<img src="../../static/assets/icons8-dislike-30.png" alt="Dislike">';
    }

    likeBtn.innerHTML =
      '<img src="../../static/assets/icons8-accept-30(1).png" alt="Like">';
    if (type === "post") {
      sendReqPost(ID, 1);
    } else if (type === "comm") {
      sendReqComment(ID, like);
    }
  }
}

function disLikeEvent(index, ID, type, disLike) {
  let likeBtn = document.querySelectorAll(".likeBtn")[index];
  let dislikeBtn = document.querySelectorAll(".dislikeBtn")[index];

  if (dislikeBtn.classList.contains("disliked")) {
    dislikeBtn.classList.remove("disliked");
    dislikeBtn.innerHTML =
      '<img src="../../static/assets/icons8-dislike-30.png" alt="Dislike"> ';
    if (type === "post") {
      sendReqPost(ID, 0);
    } else if (type === "comm") {
      sendReqComment(ID, 0);
    }
  } else {
    dislikeBtn.classList.add("disliked");

    if (likeBtn.classList.contains("liked")) {
      likeBtn.classList.remove("liked");
      likeBtn.innerHTML =
        '<img src="../../static/assets/icons8-accept-30.png" alt="Like">';
    }

    dislikeBtn.innerHTML =
      '<img src="../../static/assets/icons8-dislike-30(1).png" alt="Dislike">';
    if (type === "post") {
      sendReqPost(ID, disLike);
    } else if (type === "comm") {
      sendReqComment(ID, disLike);
    }
  }
}

const sendRequest = async (url, data) => {
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

const sendReqPost = async (postID, likeDislike) => {
  await sendRequest("../../api/likes_post", { postID, likeDislike });
};

const sendReqComment = async (commentID, likeDislike) => {
  await sendRequest("../../api/likes_comment", { commentID, likeDislike });
};

const initPostPage = async () => {
  loadNav();
  await readyPost();
};

window.addEventListener("load", initPostPage, true);
