console.log('Hello World!');

const form = document.querySelector('form');
const loadingElement = document.querySelector('.loading');
const mewsElement = document.querySelector('.mews');
const API_URL = 'http://localhost:5000/mews';
const LIKE_URL = 'http://localhost:5000/likes';
const COMMENT_URL = 'http://localhost:5000/comments';

//const API_URL = 'https://light-bird-83.serverless.social/mews';

loadingElement.style.display = '';

listAllMews();

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name');
    const content = formData.get('content');

    const mew = {
        name,
        content
    };
    //console.log(mew);
    form.style.display = 'none';
    loadingElement.style.display = '';

    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(mew),
        headers: {
            'content-type': 'application/json'
        }
    }).then(response => response.json())
      .then(createdMew => {
          //console.log(createdMew);
          form.reset();
          setTimeout(() => {
            form.style.display = '';
          }, 30000);
          listAllMews();
          loadingElement.style.display = 'none';
      });
});

//Listing all previous mews
function listAllMews() {
    mewsElement.innerHTML = '';
    fetch(API_URL)
        .then(response => response.json())
        .then(mews => {
           // console.log(mews);
            mews.reverse();
            mews.forEach(mew => {
                var div = document.createElement('div');

                const header = document.createElement('h3');
                header.textContent = mew.name;

                const flair = document.createElement('h4');
                flair.textContent = mew.type;

                const contents = document.createElement('p');
                contents.textContent = mew.content;

                const date = document.createElement('small');
                date.textContent = new Date(mew.created);
                var datee = new Date(mew.created);
                console.log(datee);

                const postId = mew._id.toString();
                console.log(postId);

                var x = document.createElement("BUTTON");
                var t = document.createTextNode("Like");
                x.appendChild(t);
                
                var likeNumber = parseInt(mew.like);

                var count = document.createElement("span");
                var num = document.createTextNode(likeNumber.toString());
                count.appendChild(num);

                var clicked = true;

                x.addEventListener('click', (event) => {
                    event.preventDefault();
                    var incr = 0;
                    if(clicked){
                        likeNumber++;
                        clicked = false;
                        incr++;
                        
                    }
                    else if(!clicked){
                        likeNumber--;
                        clicked = true;
                        incr--;
                    }
                    const newNum = div.querySelector('span');
                    newNum.innerText = likeNumber.toString();
                    updateLikes(incr, postId);
                });

                var commentForm = document.createElement("FORM");
                var commentArea = document.createElement("TEXTAREA");
                var comButton = document.createElement("BUTTON");
                var z = document.createTextNode("Comment");
                comButton.appendChild(z);

                commentArea.setAttribute("type", "text");
                commentArea.setAttribute("id", "content");
                commentArea.setAttribute("name", "content");
                commentArea.setAttribute("maxlength", "200");
                
                

                commentForm.appendChild(commentArea);
                commentForm.appendChild(comButton);

                commentForm.addEventListener('submit', (event) => {
                    event.preventDefault();
                    comList.push(commentArea.value);
                    updateComments(comList, postId);
                    location.reload();
                });

                div.appendChild(x);
                div.appendChild(count);
                div.appendChild(header);
                div.appendChild(flair);
                div.appendChild(contents);
                div.appendChild(date);
                div.appendChild(commentForm);
                //mewsElement.appendChild(div); commentForm
                var commentDiv = document.createElement("div");
                var comList = mew.comments;
                console.log(comList);
                if(!(comList.length === 0)){
                    //comList.reverse();
                    comList.forEach(comment => {
                        var yy = document.createElement("LI");
                        var tt = document.createTextNode(comment);
                        yy.appendChild(tt);
                        commentDiv.appendChild(yy);
                    });
                    div.appendChild(commentDiv);
                }
                
                mewsElement.appendChild(div);
                

            });
            loadingElement.style.display = 'none';
        });
}

function updateLikes(userIncrement, postID){
    const likee ={
        userIncrement,
        postID
    };
    fetch(LIKE_URL, {
        method: 'POST',
        body: JSON.stringify(likee),
        headers: {
            'content-type': 'application/json'
        }
    }).then(response => response.json())
}

function updateComments(commentList, postID){
    const comm ={
        commentList,
        postID
    };
    fetch(COMMENT_URL, {
        method: 'POST',
        body: JSON.stringify(comm),
        headers: {
            'content-type': 'application/json'
        }
    }).then(response => response.json())
}
