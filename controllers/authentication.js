const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../module/UserModel').User;

// registeration middleware:

module.exports.register = (req, res) => {
    const {username, password, email} = req.body
    if(!username || !password || !email) {
        return res.status(400).json('Please enter all fields...');
    };
    bcrypt.genSalt(10, (err, salt) => {
        if(err) res.status(500).json("please try again...");
        bcrypt.hash(password, salt, (err, hash) => {
            if(err) return res.status(500).json("please try again..."); 
            const newUser = new User({username, hash, email});
            newUser.save((err, user) => {
                if(err) return res.status(500).json("Username taken or email has already been used.");
                jsonwebtoken.sign(
                    { id:user.id },
                    process.env.JWTSECRET,
                    {expiresIn: 3600*24*30},
                    (err, jwt) => {
                        if(err) return res.status(500).json("please try again...");
                    res.json({
                        user: {
                            id: user.id,
                            username
                        },
                        jwt
                    })}
                )
            })
        })
    })
}

// login middleware:

module.exports.login = (req, res) => {
    const {username, password} = req.body
    if(!username || !password) {
        return res.status(400).json('Please enter all fields...');
    };
    User.findOne({username}, (err, user) => {
        if(err || !user) return res.status(400).json(`invalid username or password.`);
        bcrypt.compare(password, user.hash)
        .then(isMatch => {
            if(!isMatch) return res.status(400).json(`invalid username or password.`);
            jsonwebtoken.sign(
                { id:user.id },
                process.env.JWTSECRET,
                {expiresIn: 3600*24},
                (err, jwt) => {
                    if(err) return console.log(err)
                res.json({
                    user: {
                        id: user.id,
                        username
                    },
                    jwt
                })}
            )
        })
        .catch(err => {
            console.log(err)
        })
    })
} 

// checkes if a token is valid

module.exports.userChecker = (req, res) => {
    User.findById(req.user.id, (err, user) => {
        if(err) return res.status(400).json(`could not find a user`);
        res.send({username: user.username, id: user._id});
    })
} 