// Function to add a new comment
const addComment = async (commentText) => {
  try {
    const response = await fetch("../../api/add_comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        post_id: postID, // Assuming postID is in scope
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

    // Clear the textarea after adding the comment
    location.reload();
    document.getElementById("newCommentText").value = "";
  });
});
