const User = require('../module/UserModel').User;
const mongoose = require("mongoose");


module.exports.getRandom = (req, res) => {
    
    User.aggregate([
        {$match: {_id: {$ne: mongoose.Types.ObjectId(req.user.id)}}},
        {$match: {"posts.0": {$exists: true}}},
        {$project: {_id: 1.0, username: 1.0, posts:1.0}},
        {$unwind: '$posts'},
        {$sort: {"posts.createdAT": -1}},
        {$limit: 7}
    ], (err, docs) => {
        if(err) return res.json("could not fetch postes, sorry")
        
        res.json(docs);
    })



   
    
}


module.exports.getMoreRandom = (req, res) => {
    
    const array = req.body.map(val => {
        return mongoose.Types.ObjectId(val)
    })
        
    User.aggregate([
        {$match: {_id: {$ne: mongoose.Types.ObjectId(req.user.id)}}},
        {$match: {"posts.0": {$exists: true}}},
        {$project: {_id: 1.0, username: 1.0, posts:1.0}},
        {$unwind: '$posts'},
        {$match : {"posts._id": {$nin: array}}},
        {$sort: {"posts.createdAT": -1}},
        {$limit: 15}
    ], (err, docs) => {
        if(err) {
            return res.json([])
        }
        res.json(docs);
    })



   
    
}