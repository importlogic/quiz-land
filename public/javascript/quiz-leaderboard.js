var leaderboard = eval(response);
const loader = document.querySelector("#loaderEnabler");

const title = document.querySelector(".title");

title.innerHTML += leaderboard.quizName + " Leaderboard";

var myRank = -1;
var myScore = -1;
var rank = 1;
refreshLeaderboard();

function refreshLeaderboard(){
    loader.setAttribute("href", "/css/loader.css");

    rank = 1;
    var leaderboardList = leaderboard.participantsList;
    leaderboardList.sort((a, b) => {
        if(a.points == b.points){
            if(a.username < b.username) return -1;
            else return 1;
        }
        else return b.points - a.points;
    });
    if(leaderboardList.length == 0){
        alert("Leaderboard feels empty. Try again after some time.");
    }

    document.querySelector(".mainCon").innerHTML = `
                                                    <div class="rankBox row" style="background-color: #edeef0; font-weight: 600;">
                                                        <div class="col-2 d-Center"> Rank </div>
                                                        <div class="col-7"> Name </div>
                                                        <div class="col-3 d-Center"> Score </div>
                                                    </div>
                                                    `;

    leaderboardList.forEach((element) => {
        if(element.username == username){
            myScore = element.points;
            myRank = rank;
            showMyStatus();
        }
    
        var color = "";
        switch(rank){
            case 1:
                color = "gold";
                break;
            case 2:
                color = "silver";
                break;
            case 3:
                color = "bronze";
                break;
            default:
                color = "grey";
        }
    
        const toInsert = `
                            <div class="rankBox row">
                                <div class="col-2 d-Center"> <span class="colorBox rank-${rank}">${rank}</span> </div>
                                <div class="col-7">${element.username}</div>
                                <div class="col-3 d-Center"> <span class="colorBox rank-${rank}">${element.points}</span> </div>
                            </div>
                        `
        document.querySelector(".mainCon").innerHTML += toInsert;
    
        document.querySelectorAll(`.rank-${rank}`)[0].classList.add(color);
        document.querySelectorAll(`.rank-${rank}`)[1].classList.add(color);
    
        ++rank;
    });

    loader.setAttribute("href", null);

    if(true){
        setTimeout(() => {
            refreshService();
            refreshLeaderboard();
        }, 60 * 1000);
    }
}

function showMyStatus(){
    document.querySelector(".myRank").innerHTML = myRank;
    document.querySelector(".myScore").innerHTML = myScore;
    document.querySelector(".myInfoHeader").classList.remove("hidden");
}

async function refreshService(){
    loader.setAttribute("href", "/css/loader.css");

    const config = {
        url: "/api/get-leaderboard",
        method: "post",
        data: {
            quizID: leaderboard.quizID
        }
    }

    const axiosResponse = await axios(config);
    
    if(axiosResponse.data.status == "OK"){
        leaderboard = axiosResponse.data.leaderboard;
    }
}