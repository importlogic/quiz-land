const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    question: String,
    optionA: String,
    optionB: String,
    optionC: String,
    optionD: String,
    correctOption: String
});

const Question = new mongoose.model("Question", questionSchema);

module.exports = Question;