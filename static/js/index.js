// Fetch the JSON data from the URL
fetch('/posts')
    .then(response => response.json())
    .then(data => {
        // Process the JSON data and create HTML elements
        const jsonContainer = document.getElementById('postcardwrapper');
        data.posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.innerHTML = `
                <div class="postcard">
                    <p>User ID: ${post.user_id}</p>
                    <p>Title: ${post.title}</p>
                    <p>Category: ${post.category}</p>
                    <p>Creation Date: ${post.creation_date}</p>
                </div>
            `;
            jsonContainer.appendChild(postElement);
        });
    })
    .catch(error => console.error('Error fetching JSON:', error));