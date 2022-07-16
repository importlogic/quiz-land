const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
    username: String,
    points: Number
})

const leaderboardSchema = new mongoose.Schema({
    quizID: String,
    quizName: String,
    participantsList: [ participantSchema ]
});

const Leaderboard = new mongoose.model("Leaderboard", leaderboardSchema);

module.exports = Leaderboard;