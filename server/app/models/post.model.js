module.exports = mongoose => {
    const Post = mongoose.model(
        "post",
        mongoose.Schema(
            {
                name: String,
                content: String,
                likes: Number,
                comments: Array,
                hashtags: Array,
                type: String,
                username: String,
                commentCount: Number
            },
            { timestamps: true }
        )
    );
    return Post;
};