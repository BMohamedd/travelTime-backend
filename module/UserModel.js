const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: {type: String, required:true},
    body: {type: String, required: true}, 
    picture: {type: String},
    likeCounter: {type:Number, default: 0},
    createdAT: {type: Date, default: Date.now}
})

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    hash: {type: String, required: true},
    personalInfo: {type:[String], "default": ["true"]},
    register_date: {type: Date, default: Date.now},
    posts: {type: [PostSchema]}
});

exports.User = mongoose.model("User", UserSchema); 