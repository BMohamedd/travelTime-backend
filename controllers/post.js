const User = require('../module/UserModel').User;
const mongoose = require("mongoose");


module.exports.createPost = (req, res) => {
    const {title, picture, discription} = req.body
    if(!title || ! discription) return res.status(400).json("please check that all the fields are correct.")
   
    const postInfo = {title, picture, 
        body: discription,
        _id: mongoose.Types.ObjectId()
    };

    User.findById(req.user.id, (err, user) => {
        if(err) return res.status(500).json("my bad, please try this again!")
        user.posts.push(postInfo);
        user.save(function (err) {
            if (err) return res.status(400).json(err)
            res.json({...postInfo, likeCounter: 0});
          });
    })

}
module.exports.deletePost = (req, res) => {

    const postToDelete = req.params.id;
    if(!postToDelete) return res.status(400).json("please retry.")


    User.findById(req.user.id, (err, user) => {
        if(err) return res.status(500).json("my bad, please try this again!")
        user.posts.id(postToDelete).remove();
        user.save(function (err) {
            if (err) return res.status(400).json(err)
            res.json(postToDelete);
          });
    })

}
module.exports.addLike = (req, res) => {

    const postToLike = req.params.id;
    const userId = req.params.userId;
    if(!postToLike) return res.status(400).json("please retry.")

    User.findById(userId === "123"? req.user.id: userId, (err, user) => {
        if(err) return res.status(500).json("my bad, please try this again!")

        const postToEdit = user.posts.id(req.params.id)

        postToEdit.likeCounter++;

        user.save(function (err) {
            if (err) return res.status(400).json(err)
            res.json(postToEdit.likeCounter++);
          });
    })

}

module.exports.editpost = (req, res) => {
    const {title, picture, discription, _id} = req.body
    if(!title || ! discription || !_id) return res.status(400).json("please check that all the fields are correct.")
    

    User.findById(req.user.id, (err, user) => {
        if(err) return res.status(500).json("my bad, please try this again!");
        

        const postToEdit = user.posts.id(_id);


        if(!postToEdit) return res.status(500).json("my bad, please try this again!");
       
        postToEdit.title = title;
        postToEdit.body = discription;
        if(picture) postToEdit.picture = picture;

        user.save(function (err) {
            if (err) return res.status(400).json(err)
            res.json({postToEdit});
          });
    })

}

module.exports.myPostes = (req, res) => {
    User.findById(req.user.id, (err, user) => {
        if(err) return res.status(404).json("huh, that's weird i couldn't find what you're looking for please try to logout and log back in... ")
        res.send(user.posts)
    });
}