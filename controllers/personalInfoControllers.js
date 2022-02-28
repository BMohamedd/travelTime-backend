const User = require('../module/UserModel').User;
const mongoose = require("mongoose");

module.exports.editinfo = (req, res) => {
    if(!req.body) return res.status(400).json("please check that all the fields are correct.")

    User.findByIdAndUpdate(req.user.id, {personalInfo: req.body} , (err, user) => {
        if(err) return res.status(500).json("my bad, please try this again!");
        res.json("changes have been saved refresh the page to see them!")
    })

}
module.exports.getInfo = (req, res) => {

    User.findById(req.user.id, (err, user) => {
        if(err) return res.status(500).json("my bad, please try this again!");
        res.json(user.personalInfo)
    })

}