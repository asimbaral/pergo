module.exports = app => {
    const posts = require("../controllers/post.controller");

    var router = require('express').Router();

    // Create new post
    router.post("/", posts.create);

    // Get all posts
    router.get("/", posts.findAll);

    app.use('/api/posts', router);
}