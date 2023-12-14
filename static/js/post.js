const postID = parseInt(location.href.match(/post\/[0-9]+/)[0].replace("post/", ''))

// Fetch the JSON data from the URL
fetch(`/api/post/${postID}`)
  .then((response) => response.json())
  .then((data) => {
    // Process the JSON data and create HTML elements

  })
  .catch((error) => console.error("Error fetching JSON:", error));

// function LikeEvent(index) {
//   let likeBtn = document.querySelectorAll(".likeBtn")[index];
//   let dislikeBtn = document.querySelectorAll(".dislikeBtn")[index];
//   if (likeBtn.classList.contains("liked")) {
//     likeBtn.classList.remove("liked");
//     likeBtn.textContent = "🤍";
//     sendReq(-1);
//   } else {
//     likeBtn.classList.add("liked");
//     if (dislikeBtn.classList.contains("disliked")) {
//       dislikeBtn.classList.remove("disliked");
//       dislikeBtn.textContent = "👎🏻";
//     }
//     likeBtn.textContent = "❤️";
//     sendReq(1);
//   }
// }

// function disLikeEvent(index) {
//   let likeBtn = document.querySelectorAll(".likeBtn")[index];
//   let dislikeBtn = document.querySelectorAll(".dislikeBtn")[index];
//   if (dislikeBtn.classList.contains("disliked")) {
//     dislikeBtn.classList.remove("disliked");
//     dislikeBtn.textContent = "👎🏻";
//     sendReq(1);
//   } else {
//     dislikeBtn.classList.add("disliked");
//     if (likeBtn.classList.contains("liked")) {
//       likeBtn.classList.remove("liked");
//       likeBtn.textContent = "🤍";
//     }
//     dislikeBtn.textContent = "👎🏿";
//     sendReq(-1);
//   }
// }

// const sendReq = async (num) => {
//   fetch("/likes_post", {
//     method: "POST",
//     body: num,
//   });
// };
