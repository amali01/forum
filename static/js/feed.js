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

function FormatJson(form) {
    var formData = new FormData(form);
    var json = {};

    for (var pair of formData.entries()) {
        json[pair[0]] = pair[1];
    }

    console.log(json)

    return json;
}

function fetchAndOrganizeData() {
    fetch('/api/posts')
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

function SubmitSubforumFilterRequest() {
    //! DEPRECATED
    event.preventDefault()
    let subformFilterSearchInput = document.getElementById("subforumSearch")
    console.log(FormatJson(subformFilterSearchInput))
    fetch("/filter", {
        method: "POST",
        body: FormatJson(subformFilterSearchInput)
    })
        .then(response => response.json())
        .then(data => {
            location.reload()
        }).catch((error) => {
            console.log("ERROR SUBFORUM: " + error)
        })
}

function ModalOps() {

    var modal = document.getElementById("MainModal");
    var smodal = document.getElementById("searchModal")

    var openbtn = document.getElementById("settingBtn");
    var openSearchModal = document.getElementById("opensearchModal");

    var closebtn = document.getElementById("closebtn");
    var closeSearchBtn = document.getElementById("closeSearchModalBtn")


    openbtn.onclick = function () {
        modal.style.display = "flex";
    };

    closebtn.onclick = function () {
        modal.style.display = "none";
    };

    openSearchModal.onclick = function () {
        smodal.style.display = "flex";
        modal.style.display = "none";
    };

    closeSearchBtn.onclick = function () {
        smodal.style.display = "none";
        modal.style.display = "none";
    };
}

ModalOps()
fetchAndOrganizeData()