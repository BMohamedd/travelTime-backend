const User = require("../module/UserModel").User;
const mongoose = require("mongoose");

module.exports.createPost = (req, res) => {
  const { title, picture, discription } = req.body;
  if (!title || !discription)
    return res
      .status(400)
      .json("please check that all the fields are correct.");

  const postInfo = {
    title,
    picture,
    body: discription,
    _id: mongoose.Types.ObjectId(),
  };

  User.findById(req.user.id, (err, user) => {
    if (err) return res.status(500).json("my bad, please try this again!");
    user.posts.push(postInfo);
    user.save(function (err) {
      if (err) return res.status(400).json(err);
      res.json({ ...postInfo, likeCounter: 0 });
    });
  });
};

module.exports.deletePost = (req, res) => {
  const postToDelete = req.params.id;
  if (!postToDelete) return res.status(400).json("please retry.");

  User.findById(req.user.id, (err, user) => {
    if (err) return res.status(500).json("my bad, please try this again!");
    user.posts.id(postToDelete).remove();
    user.save(function (err) {
      if (err) return res.status(400).json(err);
      res.json(postToDelete);
    });
  });
};

module.exports.addLike = (req, res) => {
  const postToLike = req.params.id;
  const userId = req.params.userId;
  if (!postToLike) return res.status(400).json("please retry.");

  User.findById(userId === "123" ? req.user.id : userId, (err, user) => {
    if (err) return res.status(500).json("my bad, please try this again!");

    const postToEdit = user.posts.id(req.params.id);

    postToEdit.likeCounter++;

    user.save(function (err) {
      if (err) return res.status(400).json(err);
      res.json(postToEdit.likeCounter++);
    });
  });
};

module.exports.editpost = (req, res) => {
  const { title, picture, discription, _id } = req.body;
  if (!title || !discription || !_id)
    return res
      .status(400)
      .json("please check that all the fields are correct.");

  User.findById(req.user.id, (err, user) => {
    if (err) return res.status(500).json("my bad, please try this again!");

    const postToEdit = user.posts.id(_id);

    if (!postToEdit)
      return res.status(500).json("my bad, please try this again!");

    postToEdit.title = title;
    postToEdit.body = discription;
    if (picture) postToEdit.picture = picture;

    user.save(function (err) {
      if (err) return res.status(400).json(err);
      res.json({ postToEdit });
    });
  });
};

module.exports.myPostes = (req, res) => {
  User.findById(req.user.id, (err, user) => {
    if (err)
      return res
        .status(404)
        .json(
          "huh, that's weird i couldn't find what you're looking for please try to logout and log back in... "
        );
    res.send(user.posts);
  });
};

module.exports.SavePost = (req, res) => {
  const { userId, postToSaveId } = req.body;
  if (!userId || !postToSaveId)
    return res.status(400).json("Something went wrong...");

  User.findById(req.user.id, (err, user) => {
    let exists = false;
    if (err) return res.status(500).json("my bad, please try this again!");
    user.SavedPostes.forEach((value) => {
      if (
        value.userId === req.body.userId &&
        value.postToSaveId === req.body.postToSaveId
      ) {
        exists = true;
      }
    });
    if (exists === false) {
      user.SavedPostes.push(req.body);
      user.save(function (err) {
        if (err) return res.status(400).json({ seccess: false });
        res.json({ seccess: true });
      });
    } else {
      res.json({ seccess: true });
    }
  });
};

module.exports.giveSavedPostes = (req, res) => {
  User.findById(req.user.id, (error, user) => {
    if (error) res.status(404).send("something went wrong, try to relog...");
    const savedPostes = user.SavedPostes;
    if (user.SavedPostes === []) return res.status(200).json([]);
    let postesToReturn = [];

    const anotherOne = savedPostes.map((value, index) => {
      User.findById(value.userId, (error, user) => {
        if (error)
          res.status(404).send("something went wrong, try to relog...");
        let toPush = user.posts.id(value.postToSaveId);
        postesToReturn.push({ post: toPush, creator: user.username }) || null;
        if (index + 1 === savedPostes.length) {
          return res.json(postesToReturn);
        }
      });
    });
  });
};
