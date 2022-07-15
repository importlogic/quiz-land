const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    googleID: String,
    profilePicture: String,
    firstName: String,
    lastName: String,
    quizList: [ String ]
});

const User = new mongoose.model("User", userSchema);

module.exports = User;