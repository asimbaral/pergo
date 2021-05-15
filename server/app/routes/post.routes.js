module.exports = app => {
    const posts = require("../controllers/post.controller");

    var router = require('express').Router();

    // Create new post
    router.post("/", posts.create);

    // Get all posts
    router.get("/", posts.findAll);

    // Find one post with id
    router.get("/:id", posts.findOne);

    // Update post with id
    router.put("/:id", posts.update);

    // Delete post with id
    router.delete("/:id", posts.delete);

    app.use('/api/posts', router);
}