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
        res.status(400).send({ message: "The name or content can't be empty." });
        console.log("post.controller.create: 400 error, The name or content can't be empty.");
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
            console.log("post.controller.create: 500 error, ", err.message || "Failed to create post.");
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
        console.log("post.controller.findAll: 500 error, ", 
            err.message || "There was an error with the get request for the posts");
        res.status(500).send({
            message:
                err.message || "There was an error with the get request for the posts"
        });
    }
};

// Find specific post with id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Post.findById(id).then(data => {
        if (!data) {
            console.log("post.controller.findOne: 404 error, Not found Post with id " + id);
            res.status(404).send({ message: "Not found Post with id " + id });
        } else {
            res.send(data);
        }
    }).catch(err => {
        console.log("post.controller.findOne: 500 error, Error retrieving Post with id=" + id);
        res
            .status(500)
            .send({ message: err.message } || { message: "Error retrieving Post with id=" + id});
    });
}

// Update post with specific id
exports.update = (req, res) => {
    if (!req.body) {
        console.log("post.controller.update: 400 error, Data to update can't be empty!");
        return res.status(400).send({
            message: "Data to update can't be empty!"
        });
    }

    const id = req.params.id;

    Post.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                console.log(`post.controller.update: Cannot update Post with id=${id}. Maybe Post was not found!`);
                res.status(404).send({
                    message: `Cannot update Post with id=${id}. Maybe Post was not found!`
                });
            } else {
                res.send({ message: "Post was updated successfully." })
            }
        })
        .catch(err => {
            console.log("post.controller.update: Error updating Post with id=" + id);
            res.status(500).send({
                message: "Error updating Post with id=" + id
            });
        });
};

// Delete post with specific id
exports.delete = (req, res) => {
    const id = req.params.id;

    Post.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                console.log(`post.controller.delete: Cannot delete Post with id=${id}. Maybe Post was not found!`);
                res.status(400).send({
                    message: `Cannot delete Post with id=${id}. Maybe Post was not found!`
                });
            } else {
                res.send({
                    message: "Post was deleted successfully!"
                  });
            }
        })
        .catch(err => {
            console.log(`post.controller.delete: Could not delete Post with id=` + id);
            res.status(500).send({
                message: "Could not delete Post with id=" + id
              });
        });
};