const mongoose = require("mongoose");

const hashGenerator = require("./hashGenerator.js");

const User = require("../models/user.js")
const Quiz = require("../models/quiz.js");
const Leaderboard = require("../models/leaderboard.js");
const LinkMapper = require("../models/linkMapper.js");

const saveQuiz = async (userData, quizData) => {
    const id = hashGenerator.generate9();

    const newQuiz = new Quiz({
        quizID: id,
        quizName: quizData.quizName,
        isLive: true,
        timerState: quizData.timerState,
        timerValue: quizData.timerValue,
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

const mapLink = async (quizID) => {
    const hashID = hashGenerator.generate9();
    var response = hashID;

    const newMapping = new LinkMapper({
        hashLink: hashID,
        quizID: quizID
    });

    newMapping.save((err, res) => {
        if(err){
            console.log(err);
            response = false;
        }
    })

    return response;
}

const retrieveMapLink = async (quizID) => {
    const response = await LinkMapper.findOne({hashLink: quizID});

    if(response == null){
        return response;
    }
    else return response.quizID;
}

const retrieveAndRemoveMapLink = async (quizID) => {
    const response = await LinkMapper.findOne({hashLink: quizID});
    var result = "";

    if(response == null){
        return response;
    }
    else{
        result = response.quizID;
        await response.remove();
        return result;
    }
}

const endQuiz = async (quizID) => {
    var toreturn = true;

    const response = await Quiz.findOne({quizID});

    if(response == null){
        toreturn = false;
    }
    else{
        response.isLive = false;
        response.save((err, res) => {
            if(err){
                console.log(err);
                toreturn = false;
            }
        })
    }

    return toreturn;
}

module.exports = {
    saveQuiz,
    getQuiz,
    updateLeaderboard,
    getLeaderboard,
    mapLink,
    retrieveMapLink,
    retrieveAndRemoveMapLink,
    endQuiz
}