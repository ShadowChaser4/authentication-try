const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

mongoose.connect('mongodb://localhost:27017/userDB')

const userSchema = new mongoose.Schema({
  email: String,
  password: String
})
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('user', userSchema)
