const mongoose = require("mongoose");



const CommentSchema = new mongoose.Schema({
    author:{
        type: mongoose.Schema.ObjectId,
        required: [true,`Comment must have an author`]
    },
    content: {
        type:String,
        default: "No blog content"
    },
    blog: {
        type: mongoose.Schema.ObjectId,
        ref: 'Blog',
        required: [true,`Comment must be associated with a blog`]
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    }
});


module.exports = mongoose.model("Comment", CommentSchema);