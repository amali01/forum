var body = document.querySelector('body')

function OrgHTML(arr) {
    body.innerHTML += `
    <div class="postedWhoAndWhen">
        <div class="who">Posted By ${arr[0]}</div>
        <div class="when">Posted On ${arr[1]}</div>
    </div>
    <div class="postTitleAndLikes">
        <div class="PostTitle">${arr[2]}</div>
        <div class="likesndislikes">
            <div class="likenum">${arr[3]}</div>
            <div class="likendislikebtndiv">
                <img src="../assets/upvote.svg" alt="upvote" class="upBtn">
                <img src="../assets/downvote.svg" alt="downvote" class="downBtn">
            </div>
            <div class="dislikenum">0</div>
        </div>
    </div>
    <div class="postText">${arr[4]}</div>
    <div class="categories">{${arr[5]}}</div>
    <div class="comments">
        <div class="ctitle">Comments</div>
        <div class="commentsMain">
            <div class="com">
                <div class="frow">
                    <div class="uname">u/Rusteze</div>
                    <div class="likesndislikes">
                        <div class="likenum">100</div>
                        <div class="likendislikebtndiv">
                            <img src="../assets/upvote.svg" alt="upvote" class="upBtn">
                            <img src="../assets/downvote.svg" alt="downvote" class="downBtn">
                        </div>
                        <div class="dislikenum">0</div>
                    </div>
                </div>
                <div class="comcontent">
                    Well Yea assembly is fun.
                    Rust is better thoo!
                </div>
            </div>
            <div class="com">
                <div class="frow">
                    <div class="uname">u/Rusteze</div>
                    <div class="likesndislikes">
                        <div class="likenum">100</div>
                        <div class="likendislikebtndiv">
                            <img src="../assets/upvote.svg" alt="upvote" class="upBtn">
                            <img src="../assets/downvote.svg" alt="downvote" class="downBtn">
                        </div>
                        <div class="dislikenum">0</div>
                    </div>
                </div>
                <div class="comcontent">
                    Well Yea assembly is fun.
                    Rust is better thoo!
                </div>
            </div>
        </div>
    </div>
    `
}

function formatCategories(cat) {
    return "4/" + cat
}

function formatDate(dateString) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${day}-${month}-${year}`;
}

function OrgPost() {
    fetch('../samplepost.json')
        .then(response => response.json())
        .then(data => {
            const post = data;

            const userId = post.user_id;
            const title = post.title;
            const text = post.text
            const likeCount = post.like_count
            const categories = post.category;
            let strCat = ""
            let i = 0
            categories.forEach(cat => {
                strCat += formatCategories(cat)
                if (i < categories.length - 1) {
                    strCat += ", "
                }
                i++
            });
            const creationDate = formatDate(post.creation_date);
            document.title = title
            var OrganizeToArray = [userId, creationDate, title, likeCount, text, strCat]

            console.log("User ID:", userId);
            console.log("Title:", title);
            console.log("Text:", text);
            console.log("Category:", categories);
            console.log("Creation Date:", creationDate);
            console.log("----------------------");

            OrgHTML(OrganizeToArray)

        })
        .catch(error => {
            console.error('Error:', error);
        });
}

OrgPost()