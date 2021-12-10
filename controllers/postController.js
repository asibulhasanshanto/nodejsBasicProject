const factory = require('./handlerFactory');
const Post = require('./../models/postModel');

exports.getPost = factory.getOne(Post);
exports.getAllPosts = factory.getAll(Post);
exports.createPost = factory.createOne(Post);
exports.updatePost = factory.updateOne(Post);
exports.deletePost = factory.deleteOne(Post);