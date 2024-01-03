import { loadNav, isloggedIn } from "./components/navbar.js";

// globals
let gotten_posts = [{}];
let gotten_comm = [{}];

const postwrapper = document.getElementById("mPostWrapper");
const postID = parseInt(
  location.href.match(/post\/[0-9]+/)[0].replace("post/", ""),
);
console.log(postID);

async function evalLogin(fn) {
  let islogged = await isloggedIn();
  if (islogged === "true") {
    await fn();
  } else {
    window.location.replace("/login");
  }
}
// // Render navbar
// let nav = loadNav("../../"); // ../../ is to go to home /
// let body = document.body;
// body.insertAdjacentHTML("beforebegin", nav);

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
          <div class="commentsLink">comments ##count</div>

          <div id="likeBtn_${prop.post_id}" class="likeBtn ${
            prop.isLiked === 1 ? "liked" : ""
          }" >
            <img src="${
              prop.isLiked === 1
                ? "../../static/assets/icons8-accept-30(1).png"
                : "../../static/assets/icons8-accept-30.png"
            }" alt="Like">
          </div>
          <!-- Show like counts -->
          <div id="likes_${prop.post_id}">
                ${prop.post_likes}
          </div>
                <div id="dislikeBtn_${prop.post_id}" class="dislikeBtn ${
                  prop.isLiked === -1 ? "disliked" : ""
                }" >
                    <img src="${
                      prop.isLiked === -1
                        ? "../../static/assets/icons8-dislike-30(1).png"
                        : "../../static/assets/icons8-dislike-30.png"
                    }" alt="Dislike">
                </div>
          <!-- Show like counts -->
          <div id="dislikes_${prop.post_id}">
                ${prop.post_dislikes}
          </div>

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
    </div>`;
  /********* Add click listeners for post ***************/
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
  /********* END of Adding click listeners for post***************/

  /********* Add click listeners for Comments ***************/
  const likeCommButtons = document.querySelectorAll(".likeCommBtn");
  const dislikeCommButtons = document.querySelectorAll(".dislikeCommBtn");
  likeCommButtons.forEach((btn, index) => {
    btn.addEventListener("click", () =>
      evalLogin(() => LikeComm(index, btn.id.split("_")[1])),
    );
  });

  dislikeCommButtons.forEach((btn, index) => {
    console.log(index);
    btn.addEventListener("click", () =>
      evalLogin(() => disLikeComm(index, btn.id.split("_")[1])),
    );
  });
  /********* END of Adding click listeners for Comments***************/
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
    gotten_comm.push(com);
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

                              <div id="likeCommBtn_${
                                com.comment_id
                              }" class="likeCommBtn ${
                                com.isLiked === 1 ? "liked" : ""
                              }" >
                                <img src="${
                                  com.isLiked === 1
                                    ? "../../static/assets/icons8-accept-30(1).png"
                                    : "../../static/assets/icons8-accept-30.png"
                                }" alt="Like">
                              </div>
                              <!-- Show like counts -->
                              <div id="Commlikes_${com.comment_id}">
                                    ${com.comment_likes}
                              </div>
                                    <div id="dislikeCommBtn_${
                                      com.comment_id
                                    }" class="dislikeCommBtn ${
                                      com.isLiked === -1 ? "disliked" : ""
                                    }" >
                                        <img src="${
                                          com.isLiked === -1
                                            ? "../../static/assets/icons8-dislike-30(1).png"
                                            : "../../static/assets/icons8-dislike-30.png"
                                        }" alt="Dislike">
                                    </div>
                              <!-- Show like counts -->
                              <div id="Commdislikes_${com.comment_id}">
                                    ${com.comment_dislikes}
                              </div>


                        </div>
                        </div>
                    </div>
                    

                    `;
    i++;
  });

  return comdiv;
};
//////////////////////////////////////////////////////////////////////
const initPostPage = async () => {
  //  await loadNav();
  // Render navbar
  let nav = await loadNav("../../"); // ../../ is to go to home /
  let body = document.body;
  body.insertAdjacentHTML("beforebegin", nav);

  await readyPost();
};

window.addEventListener("load", initPostPage, true);

//////////////////////////////////////////////////////////////////////
//------------------------Like & DisLike of post --------------------//

const LikeEvent = async (index, postID) => {
  let likeBtn = document.querySelectorAll(".likeBtn")[index]; // selects like button
  let dislikeBtn = document.querySelectorAll(".dislikeBtn")[index]; // selects dislike button
  let like_count_area = document.getElementById(`likes_${postID}`); // selects like counts area from dom
  let dislike_count_area = document.getElementById(`dislikes_${postID}`);

  if (gotten_posts[index].isLiked === 1) {
    gotten_posts[index].isLiked = 0;
    likeBtn.classList.remove("liked");
    likeBtn.innerHTML =
      '<img src="../../static/assets/icons8-accept-30.png" alt="Like">';
    await sendReqPost(postID, 0);
  } else {
    gotten_posts[index].isLiked = 1;
    likeBtn.classList.add("liked");
    likeBtn.innerHTML =
      '<img src="../../static/assets/icons8-accept-30(1).png" alt="Like">';

    await sendReqPost(postID, 1);
  }

  if (dislikeBtn.classList.contains("disliked")) {
    dislikeBtn.classList.remove("disliked");
    dislikeBtn.innerHTML =
      '<img src="../../static/assets/icons8-dislike-30.png" alt="Dislike">';
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
      '<img src="../../static/assets/icons8-dislike-30.png" alt="Dislike">';
    await sendReqPost(postID, 0);
  } else {
    gotten_posts[index].isLiked = -1;
    dislikeBtn.classList.add("disliked");
    dislikeBtn.innerHTML =
      '<img src="../../static/assets/icons8-dislike-30(1).png" alt="Dislike">';

    await sendReqPost(postID, -1);
  }

  if (likeBtn.classList.contains("liked")) {
    likeBtn.classList.remove("liked");
    likeBtn.innerHTML =
      '<img src="../../static/assets/icons8-accept-30.png" alt="Like">';
  }
  /* fetch new like and dislike count and update the DOM */
  await get_like_dislike_count(postID).then((likes_dislikes) => {
    like_count_area.innerHTML = likes_dislikes.interactions.like_count;
    dislike_count_area.innerHTML = likes_dislikes.interactions.dislike_count;
  });
};

const get_like_dislike_count = async (postID) => {
  let interactions_obj = {};
  await fetch("../../api/postlikes", {
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
  await fetch("../../api/likes_post", {
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
//////////////////////////////////////////////////////////////////////////

//------------------------Like & DisLike of comment --------------------//

const LikeComm = async (index, CommID) => {
  let likeCommBtn = document.querySelectorAll(".likeCommBtn")[index]; // selects like button
  let dislikeCommBtn = document.querySelectorAll(".dislikeCommBtn")[index]; // selects dislike button
  let like_count_area = document.getElementById(`Commlikes_${CommID}`); // selects like counts area from dom
  let dislike_count_area = document.getElementById(`Commdislikes_${CommID}`);

  if (gotten_comm[index].isLiked === 1) {
    gotten_comm[index].isLiked = 0;
    likeCommBtn.classList.remove("liked");
    likeCommBtn.innerHTML =
      '<img src="../../static/assets/icons8-accept-30.png" alt="Like">';
    await sendReqComm(CommID, 0);
  } else {
    gotten_comm[index].isLiked = 1;
    likeCommBtn.classList.add("liked");
    likeCommBtn.innerHTML =
      '<img src="../../static/assets/icons8-accept-30(1).png" alt="Like">';

    await sendReqComm(CommID, 1);
  }

  if (dislikeCommBtn.classList.contains("disliked")) {
    dislikeCommBtn.classList.remove("disliked");
    dislikeCommBtn.innerHTML =
      '<img src="../../static/assets/icons8-dislike-30.png" alt="Dislike">';
  }
  /* fetch new like and dislike count and update the DOM */
  await get_like_dislike_count(CommID).then((likes_dislikes) => {
    like_count_area.innerHTML = likes_dislikes.interactions.like_count;
    dislike_count_area.innerHTML = likes_dislikes.interactions.dislike_count;
  });
};

const disLikeComm = async (index, CommID) => {
  let likeCommBtn = document.querySelectorAll(".likeCommBtn")[index]; // selects like button
  let dislikeCommBtn = document.querySelectorAll(".dislikeCommBtn")[index]; // selects dislike button
  let like_count_area = document.getElementById(`Commlikes_${CommID}`); // selects like counts area from dom
  let dislike_count_area = document.getElementById(`Commdislikes_${CommID}`);

  if (gotten_comm[index].isLiked === -1) {
    gotten_comm[index].isLiked = 0;
    dislikeCommBtn.classList.remove("disliked");
    dislikeCommBtn.innerHTML =
      '<img src="../../static/assets/icons8-dislike-30.png" alt="Dislike">';
    await sendReqComm(CommID, 0);
  } else {
    gotten_comm[index].isLiked = -1;
    dislikeCommBtn.classList.add("disliked");
    dislikeCommBtn.innerHTML =
      '<img src="../../static/assets/icons8-dislike-30(1).png" alt="Dislike">';

    await sendReqComm(CommID, -1);
  }

  if (likeCommBtn.classList.contains("liked")) {
    likeCommBtn.classList.remove("liked");
    likeCommBtn.innerHTML =
      '<img src="../../static/assets/icons8-accept-30.png" alt="Like">';
  }
  /* fetch new like and dislike count and update the DOM */
  await get_like_dislike_count(CommID).then((likes_dislikes) => {
    like_count_area.innerHTML = likes_dislikes.interactions.like_count;
    dislike_count_area.innerHTML = likes_dislikes.interactions.dislike_count;
  });
};

const get_comm_like_dislike_count = async (CommID) => {
  let interactions_obj = {};
  await fetch("../../api/commlikes", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      comm_id: CommID,
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

const sendReqComm = async (CommID, LikeDislike) => {
  await fetch("../../api/likes_comment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      CommentID: parseInt(CommID, 10),
      LikeDislike,
    }),
  });
};
/****************** For history of the dark ages ******************/
// const LikeEvent = async (index, postID) => {
//   let likeBtn = document.querySelectorAll(".likeBtn")[index]; // selects like button
//   let dislikeBtn = document.querySelectorAll(".dislikeBtn")[index]; // selects dislike button
//   let like_count_area = document.getElementById(`likes_${postID}`); // selects like counts area from dom
//   let dislike_count_area = document.getElementById(`dislikes_${postID}`);

//   if (gotten_posts[index].isLiked === 1) {
//     gotten_posts[index].isLiked = 0;
//     likeBtn.classList.remove("liked");
//     likeBtn.innerHTML =
//       '<img src="../../static/assets/icons8-accept-30.png" alt="Like">';
//     await sendReqPost(postID, 0);
//   } else {
//     gotten_posts[index].isLiked = 1;
//     likeBtn.classList.add("liked");
//     likeBtn.innerHTML =
//       '<img src="../../static/assets/icons8-accept-30(1).png" alt="Like">';

//     await sendReqPost(postID, 1);
//   }

//   if (dislikeBtn.classList.contains("disliked")) {
//     dislikeBtn.classList.remove("disliked");
//     dislikeBtn.innerHTML =
//       '<img src="../../static/assets/icons8-dislike-30.png" alt="Dislike">';
//   }
//   /* fetch new like and dislike count and update the DOM */
//   await get_like_dislike_count(postID).then((likes_dislikes) => {
//     like_count_area.innerHTML = likes_dislikes.interactions.like_count;
//     dislike_count_area.innerHTML = likes_dislikes.interactions.dislike_count;
//   });
// };

// const disLikeEvent = async (index, postID) => {
//   let likeBtn = document.querySelectorAll(".likeBtn")[index]; // selects like button
//   let dislikeBtn = document.querySelectorAll(".dislikeBtn")[index]; // selects dislike button
//   let like_count_area = document.getElementById(`likes_${postID}`); // selects like counts area from dom
//   let dislike_count_area = document.getElementById(`dislikes_${postID}`);

//   if (gotten_posts[index].isLiked === -1) {
//     gotten_posts[index].isLiked = 0;
//     dislikeBtn.classList.remove("disliked");
//     dislikeBtn.innerHTML =
//       '<img src="../../static/assets/icons8-dislike-30.png" alt="Dislike">';
//     await sendReqPost(postID, 0);
//   } else {
//     gotten_posts[index].isLiked = -1;
//     dislikeBtn.classList.add("disliked");
//     dislikeBtn.innerHTML =
//       '<img src="../../static/assets/icons8-dislike-30(1).png" alt="Dislike">';

//     await sendReqPost(postID, -1);
//   }

//   if (likeBtn.classList.contains("liked")) {
//     likeBtn.classList.remove("liked");
//     likeBtn.innerHTML =
//       '<img src="../../static/assets/icons8-accept-30.png" alt="Like">';
//   }
//   /* fetch new like and dislike count and update the DOM */
//   await get_like_dislike_count(postID).then((likes_dislikes) => {
//     like_count_area.innerHTML = likes_dislikes.interactions.like_count;
//     dislike_count_area.innerHTML = likes_dislikes.interactions.dislike_count;
//   });
// };

// const get_like_dislike_count = async (postID) => {
//   let interactions_obj = {};
//   await fetch("../../api/postlikes", {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       post_id: postID,
//     },
//   })
//     .then((resp) => {
//       return resp.json();
//     })
//     .then((data) => {
//       interactions_obj = data;
//       console.log(interactions_obj);
//     });

//   return interactions_obj;
// };

// const sendRequest = async (url, data) => {
//   await fetch(url, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });
// };

// const sendReqPost = async (postID, likeDislike) => {
//   await sendRequest("../../api/likes_post", { postID, likeDislike });
// };

// const sendReqComment = async (commentID, likeDislike) => {
//   await sendRequest("../../api/likes_comment", { commentID, likeDislike });
// }
/****************** END ******************/
