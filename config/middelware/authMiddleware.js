const jsonwebtoken = require('jsonwebtoken');
require('dotenv').config()

const authMW = (req, res, next) => {
    
    const jwt = req.header("x-auth-token");

    if(!jwt) return res.status(401).send("Please Login or register...");
    
    try {
        const decoded = jsonwebtoken.verify(jwt, process.env.JWTSECRET);
        req.user = decoded;
        next()
    }catch {err => {
        return res.status(400).send(err);
    }}
};

module.exports = authMW;