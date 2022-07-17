const router = require('express').Router();

const quizInterface = require("../modules/quizInterface.js");
const authMiddleware = require("../middlewares/auth.js");

router.post("/api/validator/:item", async (req, res) => {
    const toValidate = req.params.item;
    var quizID = req.body.quizID;

    quizID = await quizInterface.retrieveMapLink(quizID);

    if(quizID == null){
        res.send({status: "FAILED"});
    }
    else if(toValidate == "id"){
        const quizData = await quizInterface.getQuiz(quizID);
        
        if(quizData == null){
            res.send({status: "FAILED"});
        }
        else {
            res.send({status: "OK", isLive: quizData.isLive});
        }
    }
    else if(toValidate == "username"){
        const username = req.body.username;

        if(username == ""){
            res.send({status: "FAILED"});
        }
        else{
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
    }
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

router.post("/api/update-leaderboard/:quizID", async (req, res) => {
    const quizID = req.params.quizID;

    const response = await quizInterface.updateLeaderboard(quizID, req.body);

    if(response){
        res.send({status: "OK"});
    }
    else{
        res.send({status: "FAILED"});
    }
})

router.post("/api/fetchUser", (req, res) => {
    if(req.user){
        res.send({status: "OK", user: req.user});
    }
    else res.send({status: "FAILED"});
})

router.post("/api/get-quiz", async (req, res) => {
    const quizID = req.body.quizID;
    const response = await quizInterface.getQuiz(quizID);

    if(response == null){
        res.send({status: "FAILED"});
    }
    else{
        res.send({status: "OK", quizData: response});
    }
})

router.post("/api/mapUniqueID", async (req, res) => {
    const quizID = req.body.quizID;

    const response = await quizInterface.mapLink(quizID);

    if(response){
        res.send({status: "OK", hashID: response});
    }
    else{
        res.send({status: "FAILED"});
    }
})

router.post("/api/endQuiz", async (req, res) => {
    const quizID = req.body.quizID;

    const response = await quizInterface.endQuiz(quizID);

    if(response){
        res.send({status: "OK"});
    }
    else{
        res.send({status: "FAILED"});
    }
})

router.post("/api/redirector", async (req, res) => {
    const url = req.body.url;
    res.redirect(url);
})

module.exports = router;