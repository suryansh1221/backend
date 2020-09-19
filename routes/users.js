const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require('cors');
const passport = require('passport');
const passportConfig = require('../middleware/passport')
// const keys = require("../../config/keys");
// Load input validation
// const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("./login");
const Users = require("../models/user");
const config = require('../config/default.json')
const auth = require('../middleware/auth')
// Load User x  
// const User = require("../../models/User");

router.post('/login', (req, res) => {
  let { errors, isValid } = validateLoginInput(req.body);
  // console.log(errors)
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;
  Users.findOne({ username: email }).then(user => {
    // Check if user exists
    
    if (!user) {
      // console.log(user)
      errors={ email: "Invalid credentials" }
      return res.status(404).json(errors);
    }
    console.log(email, password);
    //validating password
    bcrypt.compare(password, user.password).then(isMatch => {
      if(!isMatch)return res.status(400).json({message: 'Invalid credentials'})
      jwt.sign(
        {id: user._id},
        config['jwtSecret'],
        { expiresIn: 3600 },
        (err, token) => {
          if(err) throw err
          res.cookie('access_token', token, {httpOnly: true, sameSite: true});
          return  res.json({message: 'success', token: token})
        }
      )
    })
  })
})

router.post('/register', cors(), async(req, res) => {
  let { errors, isValid } = validateLoginInput(req.body);
  // console.log(errors)
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  let password = req.body.password;
  let id;
  //hashing password
  bcrypt.genSalt(10, async(err, salt) => {
    bcrypt.hash(password,salt, async(err, hash) => {
      if(err)throw err
      password = hash
      try {
      //  const res =  await Users.collection.insert({username: email, password: password})
      let newUser = new Users({
        username: email,
        password: password       
      }) 
      newUser.save()
             .then(user => {
               return res.json({message: 'success'})
             })
      //  console.log(res.ops[0]._id)
      //  return 
      } catch (error) {
        return res.status(404).json(err)
      }
      // return res.status(200).json({message: 'success'})
    })
    })
  })
  router.get('/logout',passport.authenticate('jwt', {session: false}), (req, res) => {
    res.clearCookie('access_token');
    res.json({success: true});
  });
module.exports = router