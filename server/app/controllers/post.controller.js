const db = require('../models');
const Post = db.post;

function isValidPost(post) {
    return post.name && post.name.toString().trim() != '' 
        && post.content && post.content.toString().trim() != '';
}
// Create and save a new post
exports.create = (req, res) => {
    // Validate post
    if (!isValidPost(req.body)) {
        res.status(400).send({ message: "The name or content can't be empry." });
        return;
    }

    // Create post entry
    const pergoPost = new Post({
        name: req.body.name,
        content: req.body.content,
        likes: 0,
        comments: [],
        hashtags: (req.body.content.toString()).match(/#\w+/g) || [],
        type: req.body.type || "Undefined"
    });
    console.log(req.body);
    pergoPost.save(pergoPost)
        .then(data => {
            res.send(data);
        }).catch(err => {
            console.log(err.message);
            res.status(500).send({
                message:
                    err.message || "Failed to create post."
            });
        });
};

// Get all requests
exports.findAll = async (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { $regex: new RegExp(title), $options: "i" } } : {};
    try {
        const { page = 1, limit = 10 } = req.query;
        const postList = await Post.find(condition)
        .sort({$natural:-1})
        .limit(limit * 1)
        .skip((page - 1) * limit);
        res.send(postList);
    } catch (err) {
        res.status(500).send({
            message:
                err.message || "There was an error with the get request for the posts"
        });
    }
};