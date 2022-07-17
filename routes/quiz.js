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

router.post("/quiz/play", async (req, res) => {
    var invite = req.body.quizID;
    const username = req.body.username;

    invite = await quizInterface.retrieveAndRemoveMapLink(invite);

    if(invite == null){
        res.redirect("/quiz/start");
    }
    else{
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
    }
})

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
        res.status(404).render("broken.ejs",
        {
            code: "404"
        });
    }
    else{
        res.render("./quiz/leaderboard.ejs", {
            response,
            username
        });
    }

});

module.exports = router;