const mongoose = require('mongoose');
const validator = require('validator');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'title is required']
    },
    body: {
        type: String,
        required: [true, 'body is required'],
        minlength: 10,
    }
});

const Post = mongoose.model('Post',postSchema);
module.exports = Post;