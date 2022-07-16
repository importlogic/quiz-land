const router = require('express').Router();

const quizInterface = require("../modules/quizInterface.js");

router.get("/quiz/start", async (req,res) => {
    var invite = "";

    const queryJSON = req.query;
    for(var key in queryJSON){
        if(key == "invite"){
            invite = queryJSON[key];
        }
    }

    res.render("./quiz/startQuiz.ejs", {
        invite
    })
});

router.post("/quiz/validator/:item", async (req, res) => {
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

router.post("/quiz/play", async (req, res) => {
    const invite = req.body.quizID;
    const username = req.body.username;

    const response = await quizInterface.getQuiz(invite);
    
    if(response == null){
        res.redirect("/quiz/start");
    }
    else{
        for(var i in response.questions){
            response.questions[i].correctOption = "lol";
        }
        res.render("./quiz/mainPage.ejs",{
            response,
            username
        });
    }
})

router.post("/quiz/updateLeaderboard/:quizID", async (req, res) => {
    const quizID = req.params.quizID;

    const response = await quizInterface.updateLeaderboard(quizID, req.body);

    if(response){
        res.send({status: "OK"});
    }
    else{
        res.send({status: "FAILED"});
    }
});

router.get("/quiz/leaderboard/:quizID", async (req, res) => {
    const quizID = req.params.quizID;

    var username = "";
    const queryJSON = req.query;
    for(var key in queryJSON){
        if(key == "watch"){
            username = queryJSON[key];
        }
    };

    const response = await quizInterface.getLeaderboard(quizID);

    if(response == null){
        res.send({message: "not found"});
    }
    else{
        res.render("./quiz/leaderboard.ejs", {
            response,
            username
        });
    }

});

module.exports = router;