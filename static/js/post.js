const postwrapper = document.getElementById("mPostWrapper");
const postID = parseInt(
  location.href.match(/post\/[0-9]+/)[0].replace("post/", "")
);
console.log(postID);
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

  commentArray.comments.forEach((com) => {
    comdiv += `<div class="scomment">
                        <div class="nameandlogo">
                            <div class="pfpImage">
                                <img src="../../static/assets/reddit.png" alt="reddit lol" class="pimg">
                            </div>
                            <div class="profileName">${com.user_name}</div>
                            <div class="commentDate">${new Date(com.creation_date)}</div>
                        </div>
                        <div class="commenttext">
                            ${com.comment}
                        </div>
                        <div class="commentInfo">
                            <div class="comlikesdislikes">
                                <div class="likeBtn">🤍 ${com.comment_likes}</div>
                                <div class="dislikeBtn">👎🏻 ${com.comment_dislikes}</div>
                            </div>
                        </div>
                    </div>

                    `;
  });
  return comdiv;
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
                        <div class="postDate">${new Date(prop.creation_date)}</div>
                        <div class="commentsLink">comments</div>
                        <div class="likesdislikes">
                            <div class="likeBtn">🤍</div>
                            <div class="dislikeBtn">👎🏻</div>
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
            </div>
        `;
};

const readyPost = async () => {
  let Response = await fetch(`/api/post/${postID}`);
  if (!Response.ok) {
    console.log("ERROR FETCHING DATA");
  }
  let postData = await Response.json();

  await orgPostHTML(postwrapper, postData);
};

readyPost();
