const leaderboard = eval(response);
var rank = -1;

const title = document.querySelector(".title");

title.innerHTML += leaderboard.quizName + " Leaderboard";

if(username != ""){
    const t = leaderboard.participantsList.find((element) => {
        return (element.username == username);
    });
    console.log(t);
}