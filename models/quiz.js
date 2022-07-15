const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    question: String,
    optionA: String,
    optionB: String,
    optionC: String,
    optionD: String,
    correctOption: String
});

const quizSchema = new mongoose.Schema({
    quizID: String,
    questions: [ questionSchema ]
});

const Quiz = new mongoose.model("Quiz", quizSchema);

module.exports = Quiz;