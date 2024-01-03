import { loadNav } from "./components/navbar.js";
import { orgPostHTML } from "./components/postComponent.js";
import { evalLogin } from "./helper_funcs/evalLogin.js";
// globals
let gotten_posts = [{}];
let gotten_comm = [{}];

const postwrapper = document.getElementById("mPostWrapper");
const postID = parseInt(
  location.href.match(/post\/[0-9]+/)[0].replace("post/", ""),
);
console.log(postID);

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
  await orgPostHTML(postwrapper, postData, postID);

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

/*************************Like & DisLike of post *********************/

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

// below triggers unused function warning
// const get_comm_like_dislike_count = async (CommID) => {
//   let interactions_obj = {};
//   await fetch("../../api/commlikes", {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       comm_id: CommID,
//     },
//   })
//     .then((resp) => {
//       return resp.json();
//     })
//     .then((data) => {
//       interactions_obj = data;
//     });
//
//   return interactions_obj;
// };

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

// App entry point
const initPostPage = async () => {
  //  await loadNav();
  // Render navbar
  let nav = await loadNav("../../"); // ../../ is to go to home /
  let body = document.body;
  body.insertAdjacentHTML("beforebegin", nav);

  await readyPost();
};
window.addEventListener("load", initPostPage, true);

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
