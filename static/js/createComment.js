// Function to add a new comment
const addComment = async (commentText) => {
  try {
    const response = await fetch("../../api/add_comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        post_id: postID,
        content: commentText,
      }),
    });

    if (!response.ok) {
      console.error("Error adding comment");
      return;
    }

    const newComment = await response.json();

    // Update the UI with the newly added comment
    const commentDiv = document.querySelector(".postcomments .comment");
    const newCommentHTML = await orgComments([newComment]);
    commentDiv.innerHTML += newCommentHTML;


  } catch (error) {
    console.error("Error adding comment:", error);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  // Handle form submission
  const commentForm = document.getElementById("newCommentForm");
  commentForm.addEventListener("submit", async(event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    
    let islogged = localStorage.getItem("isloggedIn");
    if (islogged === "false") {
      window.location.replace('/login')
      return
    }

    // Get the comment text from the textarea
    const commentText = document.getElementById("newCommentText").value;

    // Call the addComment function with the comment text
    addComment(commentText);

    // reloading the page to show the new comment
    location.reload();
    // Clear the textarea after adding the comment
    document.getElementById("newCommentText").value = "";
  });
});

// get the post ID
const postID = parseInt(
  location.href.match(/post\/[0-9]+/)[0].replace("post/", ""),
);
