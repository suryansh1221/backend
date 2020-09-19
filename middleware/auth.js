const jwt = require('jsonwebtoken')
const config = require('../config/default.json')

function auth(req, res, next){
    const token = req.header('x-auth-token')

    if(!token){
        res.status(401).json({message: 'no token , authorization denied'})
    }
    try {
         //verify token
        const decoded  = jwt.verify(token, config['jwtSecret'])
        // add user from payload
        req.user = decoded
        next()
    } catch (error) {
        res.status(400).json({message: 'Token is not valid'})
    }
   
}

module.exports = auth