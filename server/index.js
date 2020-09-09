const express = require('express');
const cors = require('cors');
const monk =  require('monk');
const Filter = require('bad-words');
const rateLimit = require('express-rate-limit');

const app = express();

//const db = monk('localhost/meower');
//const db = monk('wet-owl-74.serverless.social/goals');
//const db = https://wet-owl-74.serverless.social/
const db = monk(process.env.MONGO_URI || 'localhost/update1');
const likeDB = monk(process.env.MONGO_URI || 'localhost/two');
const mews =  db.get('mews'); 
const filter = new Filter();
const likes = likeDB.get('likes');
const comments = likeDB.get('comments');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'PerGO'
    });
});
//db
app.get('/mews', (req, res) => {
    mews
        .find()
        .then(mews => {
            res.json(mews);
        });
});;
//likeDB
app.get('/likes', (req, res) => {
    likes
        .find()
        .then(likes => {
            res.json(likes);
        });
});;

app.get('/comments', (req, res) => {
    comments
        .find()
        .then(comments => {
            res.json(comments);
        });
});;

function isValidMew(mew){
    return mew.name && mew.name.toString().trim() != '' &&
        mew.content && mew.content.toString().trim() != '';
}

app.use(rateLimit({
    windowMs: 30 * 1000, 
    max: 20 
  }));
app.post('/mews', (req, res) => {
    if(isValidMew(req.body)) {
        // Insert into db 
        const mew = {
            name: filter.clean(req.body.name.toString()),
            content: filter.clean(req.body.content.toString()),
            created: new Date(),
            like: 0,
            comments: [],
            hashtags: (req.body.content.toString()).match(/#\w+/g),
            type: req.body.type.toString()
        }; 
        mews
            .insert(mew)
            .then(createdMew => {
                res.json(createdMew);
            });
        
    } else{
        res.status(422);
        res.json({
            message: "Hey! Name and Content are required!"
        });
    }
});

app.post('/likes', (req, res) => {
    const likeCount = {
        increment: req.body.userIncrement,
        id: req.body.postID.toString()
    };
    mews.update({_id: (likeCount.id)}, {$inc:{like:likeCount.increment}});
});

app.post('/comments', (req, res) => {
    const commentCount = {
        newComments: req.body.commentList,
        id: req.body.postID.toString()
    };
    mews.update({_id: (commentCount.id)}, {$set:{comments:commentCount.newComments}});
});

let port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log('Listening on http://localhost:5000');
});