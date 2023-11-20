// Fetch the JSON data from the URL
fetch('/api/posts')
    .then(response => response.json())
    .then(data => {
        // Process the JSON data and create HTML elements
        const jsonContainer = document.getElementsByClassName('postcardwrapper')[0];
        data.posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = "postcard"
            postElement.innerHTML = `
        <div class="postWrapper">
            <div class="postImage"></div>
            <div class="dataWrapper">
                <div class="data">
                    <div class="title_category">
                        <div class="title bold_text">${post.title}</div>    
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
                            <p>{commentsCount}</p>
                            <p>${post.likes_count}</p>
                        </div>
                    </div>
                </div>
                <div>likeICON</div>
            </div>
        </div>
            `;
            jsonContainer.appendChild(postElement);

        });
    })
    .catch(error => console.error('Error fetching JSON:', error));