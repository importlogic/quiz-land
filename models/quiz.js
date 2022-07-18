const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    questionText: String,
    optionA: String,
    optionB: String,
    optionC: String,
    optionD: String,
    correctOption: String
});

const quizSchema = new mongoose.Schema({
    quizID: String,
    quizName: String,
    isLive: Boolean,
    timerState: Number,
    timerValue: Number,
    questions: [ questionSchema ]
});

const Quiz = new mongoose.model("Quiz", quizSchema);

module.exports = Quiz;