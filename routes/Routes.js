const express = require('express');
const router = express.Router();
const auth = require('../controllers/authentication');
const post = require('../controllers/post')
const userinfo = require('../controllers/personalInfoControllers')
const bcrypt = require("bcryptjs");
const jsonwebtoken = require('jsonwebtoken');
const authMW = require('../config/middelware/authMiddleware');

// testing route

router.get('/', (req, res) => {
    res.send('its alive!')
})

// authentication routes:

router.post("/register", auth.register);

// login routes: 

router.post("/login", auth.login);

// checke token;

router.get("/does-user-exist", authMW, auth.userChecker)

// add a new post 

router.post("/create-a-new-post", authMW, post.createPost);

// edit an existing post

router.put("/edit-post", authMW, post.editpost);

// delete an existing post

router.delete("/delete-post/:id", authMW, post.deletePost);

// add a like to an existing post
router.get("/like/:id", authMW, post.addLike);

// get postes for profile page

router.get('/my-postes', authMW, post.myPostes)

// edit user information

router.post('/edit-my-personal-information', authMW, userinfo.editinfo)

// get personal information 

router.get('/get-my-personal-info', authMW, userinfo.getInfo)


module.exports = router
