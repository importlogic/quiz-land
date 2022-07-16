const mongoose = require("mongoose");
const crypto = require("crypto");

const User = require("../models/user.js")
const Quiz = require("../models/quiz.js");
const Leaderboard = require("../models/leaderboard.js");

const saveQuiz = async (userData, quizData) => {
    var id = "";
    for(var i = 0; i < 6; i++) id += Math.floor(Math.random() * 10);
    id = crypto.createHash('sha256').update(id).digest('hex');
    const offset = Math.floor(Math.random() * 56);
    id = id.slice(offset, offset + 9);

    const newQuiz = new Quiz({
        quizID: id,
        quizName: quizData.quizName,
        questions: quizData.questions
    });

    var response = true;

    newQuiz.save((err, res) => {
        if(err){
            console.log(err);
            response = false;
        }
    });

    const newLeaderboard = new Leaderboard({
        quizID: id,
        quizName: quizData.quizName,
        participantsList: []
    });

    newLeaderboard.save((err, res) => {
        if(err){
            consol.log(err);
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

const getQuiz = async (invite) => {
    const response = await Quiz.findOne({quizID: invite});

    return response;
}

const updateLeaderboard = async (quizID, userData) => {
    var response = true;

    const quizData = await Quiz.findOne({quizID});

    const question = quizData.questions.find((element) => {
        return element._id == userData.questionID;
    })
    const correctOption = question.correctOption;

    var userLeaderboard = await Leaderboard.findOne({quizID});
    var participantsList = userLeaderboard.participantsList;

    const participant = participantsList.find((element) => {
        return element.username ==  userData.username;
    })

    if(participant == undefined){
        var userPoints = ((correctOption == userData.userResponse) ? 1 : 0);
        participantsList.push({
            username: userData.username,
            points: userPoints
        });
    }
    else{
        participant.points += ((correctOption == userData.userResponse) ? 1 : 0);
    }

    userLeaderboard.save((err, res) => {
        if(err){
            console.log(err);
            response = false;
        }
    })

    return response;
}

const getLeaderboard = async (quizID) => {
    const response = await Leaderboard.findOne({quizID});

    return response;
}

module.exports = {
    saveQuiz,
    getQuiz,
    updateLeaderboard,
    getLeaderboard
}