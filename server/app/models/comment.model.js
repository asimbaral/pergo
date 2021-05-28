module.exports = mongoose => {
    const Comment = mongoose.model(
        "comment",
        mongoose.Schema(
            {
                userID: String,
                postID: String,
                comments: Array
            },
            { timestamps: true }
        )
    );
    return Comment;
};