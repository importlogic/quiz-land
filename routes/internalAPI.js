const router = require('express').Router();

const quizInterface = require("../modules/quizInterface.js");

router.post("/api/validator/:item", async (req, res) => {
    const toValidate = req.params.item;

    if(toValidate == "id"){
        const quizID = req.body.quizID;
        const quizData = await quizInterface.getQuiz(quizID);
        
        if(quizData == null){
            res.send({status: "FAILED"});
        }
        else {
            res.send({status: "OK"});
        }
    }
    else if(toValidate == "username"){
        const quizID = req.body.quizID;
        const username = req.body.username;

        const leaderboard = await quizInterface.getLeaderboard(quizID);

        const result = leaderboard.participantsList.find((element) => {
            return element.username == username;
        })

        if(result == undefined){
            res.send({status: "OK"});
        }
        else{
            res.send({status: "FAILED"});
        }
    }
})


router.post("/api/redirector", async (req, res) => {
    const url = req.body.url;
    res.redirect(url);
})

router.post("/api/get-leaderboard", async (req, res) => {
    const quizID = req.body.quizID;

    const response = await quizInterface.getLeaderboard(quizID);

    if(response == null){
        res.send({status: "FAILED"});
    }
    else{
        res.send({status: "OK", leaderboard: response});
    }
})


module.exports = router;