const mongoose = require("mongoose");
const crypto = require("crypto");

const User = require("../models/user.js")
const Quiz = require("../models/quiz.js");
const Question = require("../models/question.js");

const saveQuiz = async (userData, quizData) => {
    var id = "";
    for(var i = 0; i < 6; i++) id += Math.floor(Math.random() * 10);
    id = crypto.createHash('sha256').update(id).digest('hex');
    const offset = Math.floor(Math.random() * 56);
    id = id.slice(offset, offset + 9);

    const newQuiz = new Quiz({
        quizID: id,
        questions: quizData.questions
    });

    var response = true;

    newQuiz.save((err, res) => {
        if(err){
            console.log(err);
            response = false;
        }
    });

    
    var user = await User.findOne({googleID: userData.googleID});
    user.quizList.push(id);
    user.save((err, res) => {
        if(err){
            console.log(err);
            response = false;
        }
    });

    return response;
}

module.exports = {
    saveQuiz,
    // getQuiz
}