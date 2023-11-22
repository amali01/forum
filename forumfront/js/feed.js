var grid = document.querySelector(".mainwrapper")

function formatDate(dateString) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${day}-${month}-${year}`;
}

function UpdateHTML(arr) {
    grid.innerHTML += `
    <div class="GridItemPost">
    <div class="post">
        <div class="postedBy">Posted By ${arr[0]}</div>
        <div class="mainPostDiv">
            <div class="downvote">
                <div class="counter">0</div>
                <img src="../assets/downvote.svg" alt="downvote" class="downBtn">
            </div>
            <div class="maincontentPost">
                <div class="title">${arr[1]}</div>
                <div class="category">${arr[2]}</div>
            </div>
            <div class="upvote">
                <img src="../assets/upvote.svg" alt="upvote" class="upBtn">
                <div class="counter">50</div>
            </div>
        </div>
        <div class="creationDateDiv">${arr[3]}</div>
    </div>
</div>
    `
}

function fetchAndOrganizeData() {
    //! DEPRECATED: event class is deprecated, ensure to replace in
    //! Later iterations of this project
    event.preventDefault()
    fetch('../samplefeed.json')
        .then(response => response.json())
        .then(data => {
            const posts = data.posts;

            posts.forEach(post => {
                const userId = post.user_id;
                const title = post.title;
                const category = post.category;
                const creationDate = formatDate(post.creation_date);

                var OrganizeToArray = [userId, title, category, creationDate]

                // Do something with the organized data
                console.log("User ID:", userId);
                console.log("Title:", title);
                console.log("Category:", category);
                console.log("Creation Date:", creationDate);
                console.log("----------------------");

                UpdateHTML(OrganizeToArray)
            });

        })
        .catch(error => {
            console.error('Error:', error);
        });
}

fetchAndOrganizeData()