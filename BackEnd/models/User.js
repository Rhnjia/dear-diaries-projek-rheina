const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    pin: String,
    profilePic: String
});

module.exports = mongoose.model('User', UserSchema);