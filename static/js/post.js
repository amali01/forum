const postwrapper = document.getElementById("mPostWrapper");
const postID = parseInt(
  location.href.match(/post\/[0-9]+/)[0].replace("post/", "")
);
console.log(postID);

const readyPost = async () => {
  let Response = await fetch(`/api/post/${postID}`);
  if (!Response.ok) {
    console.log("ERROR FETCHING DATA");
  }
  let postData = await Response.json();

  await orgPostHTML(postwrapper, postData);
};

// function to add post divs to post wrapper
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
                          <div class="likeBtn" onclick="LikeEvent(0, ${postID}, 'post', 1)">
                             <img src="../../static/assets/icons8-accept-30.png" alt="like Heart">
                          </div>
                          ${prop.post_likes}
                          <div class="dislikeBtn" onclick="disLikeEvent(0, ${postID}, 'post', -1)">
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
                              <div class="likeBtn" onclick="LikeEvent(${i}, ${com.comment_id}, 'comm', 1)">
                                <img src="../../static/assets/icons8-accept-30.png" alt="like Heart">
                              </div>
                              ${com.comment_likes}
                              <div class="dislikeBtn" onclick="disLikeEvent(${i}, ${com.comment_id}, "comm", -1)">
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
    likeBtn.innerHTML = '<img src="../../static/assets/icons8-accept-30.png" alt="Like">';
     if (type === "post") {
        sendReqPost(ID, 0);
      } else if (type === "comm") {
        sendReqCommnet(ID, 0);  
      }
  } else {
    likeBtn.classList.add("liked");

    if (dislikeBtn.classList.contains("disliked")) {
      dislikeBtn.classList.remove("disliked");
      dislikeBtn.innerHTML = '<img src="../../static/assets/icons8-dislike-30.png" alt="Dislike">';
    }

    likeBtn.innerHTML = '<img src="../../static/assets/icons8-accept-30(1).png" alt="Like">';
    if (type === "post") {
      sendReqPost(ID, 1);
    } else if (type === "comm") {
      sendReqCommnet(ID, like);
    }
    sendReqPost(postID, like);
  }
}

function disLikeEvent(index ,ID, type, disLike) {
  let likeBtn = document.querySelectorAll(".likeBtn")[index];
  let dislikeBtn = document.querySelectorAll(".dislikeBtn")[index];

  if (type === "post") {
    if (dislikeBtn.classList.contains("disliked")) {
      dislikeBtn.classList.remove("disliked");
      dislikeBtn.innerHTML = '<img src="../../static/assets/icons8-dislike-30.png" alt="Dislike"> ';
      if (type === "post") {
        sendReqPost(ID, 0);
      } else if (type === "comm") {
        sendReqCommnet(ID, 0);
      }
    } else {
      dislikeBtn.classList.add("disliked");
      if (likeBtn.classList.contains("liked")) {
        likeBtn.classList.remove("liked");
        likeBtn.innerHTML = '<img src="../../static/assets/icons8-accept-30.png" alt="Like">';
      }
      dislikeBtn.innerHTML = '<img src="../../static/assets/icons8-dislike-30(1).png" alt="Dislike">';
      if (type === "post") {
        sendReqPost(ID, disLike);
      } else if (type === "comm") {
        sendReqCommnet(ID, disLike);
      }
    }
  }
}

const loadCats = async () => {
  const catwrapper = document.getElementById("allcats");
  let response = await fetch("../../api/categories");
  console.log(response);
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

// const sendReqPost = async (postID, likeDislike) => {
//   fetch("../../api/likes_post", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       postID,
//       likeDislike,
//     }),
//   });
// };

// const sendReqCommnet = async (commentID, likeDislike) => {
//   fetch("../../api/likes_comment", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       commentID,
//       likeDislike,
//     }),
//   });
// };

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

readyPost();
window.addEventListener("load", loadCats);
