const mongoose = require('mongoose');
 
const Users = require('./user');
 
const connectDb = () => {
  return mongoose.connect('mongodb://localhost:27018/tatadb');
};
 
const models = { Users/*, Message*/ };
 
module.exports =  { connectDb, models };
 
