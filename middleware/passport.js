const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const config = require('../config/default.json');
const Users = require('../models/user');

const cookieExtracter = req => {
    let token = null;
    if(req && req.cookies){
        token = req.cookies['access_token'];
    }
    return token;
}

passport.use(new JwtStrategy({
    jwtFromRequest : cookieExtracter,
    secretOrKey : config['jwtSecret']
}, (payload, done) => {
    Users.findById({_id : payload.id}, (err, user) => {
        if(err)
            return done(err, false);
        if(user)
            return done(null, user);
        else
            return done(null, false);
    });
}));