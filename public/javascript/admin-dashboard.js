const loader = document.querySelector("#loaderEnabler");

// sidebar 
const pages = [ "dashboard-page", "create-page"];
const menuItems = [ "menu-dashboard", "menu-create"];

menuItems.forEach((current) => {
    document.querySelector(`#${current}`).addEventListener("click", () => {
        menuItems.forEach((item) => {
            document.querySelector(`#${item}`).classList.remove("active");
            document.querySelector(`#${item}`).classList.add("fw-bold");
            const pageName = item.slice(5) + "-page";
            document.querySelector(`#${pageName}`).classList.add("hidden");
        })
        document.querySelector(`#${current}`).classList.add("active");
        document.querySelector(`#${current}`).classList.remove("fw-bold");
        const pageName = current.slice(5) + "-page";
        document.querySelector(`#${pageName}`).classList.remove("hidden");
    })
});

var el = document.getElementById("wrapper");
var toggleButton = document.getElementById("menu-toggle");

toggleButton.onclick = function () {
    el.classList.toggle("toggled");
};


// main 
var user;
var leaderboardList = [];
var quizList = [];


fetchData();

async function fetchData(){
    loader.setAttribute("href", "/css/loader.css");
    await fetchUser();
    await fetchLeaderboard();
    await fetchQuiz();
    updateDashboard();
}

document.querySelector(".dashboardRefresh").addEventListener("click", fetchData);

async function fetchUser(){
    const config = {
        url: "/api/fetchUser",
        method: "post"
    }

    const axiosResponse = await axios(config);

    if(axiosResponse.data.status == "OK"){
        user = axiosResponse.data.user;
    }
    else{
        alert("Cannot fetch User Right now. Please try again later.");
    }
}

async function fetchLeaderboard(){
    leaderboardList.length = 0;
    for(var i in user.quizList){
        const config = {
            url: "/api/get-leaderboard",
            method: "post",
            data:{
                quizID: user.quizList[i]
            }
        }
        const axiosResponse = await axios(config);

        if(axiosResponse.data.status == "OK"){
            leaderboardList.push(axiosResponse.data.leaderboard);
        }
        else{
            alert("Cannot fetch Leaderboards Right now. Please try again later.");
            break;
        }
    }
}

async function fetchQuiz(){
    quizList.length = 0;
    for(var i in user.quizList){
        const config = {
            url: "/api/get-quiz",
            method: "post",
            data:{
                quizID: user.quizList[i]
            }
        }

        const axiosResponse = await axios(config);

        if(axiosResponse.data.status == "OK"){
            quizList.push(axiosResponse.data.quizData);
        }
        else{
            alert("Cannot fetch Quizzes Right now. Please try again later.");
            break;
        }
    }
    quizList.reverse();
}

function updateDashboard(){
    document.querySelector(".userWelcome").innerHTML = `<strong>Welcome, ${user.firstName} ${user.lastName}</strong>`;
    document.querySelector(".quizCount").innerHTML = user.quizList.length;


    document.querySelector(".dashboardQuizTable").innerHTML = "";
    var totalParticipants = 0;
    var serial = 1;
    for(var i in quizList){
        const current = leaderboardList.find((element) => {
            return element.quizID == quizList[i].quizID;
        }) 
        const toinsert = `
                            <tr>
                                <th scope="row">${serial}</th>
                                <td>${quizList[i].quizName}</td>
                                <td>${current.participantsList.length}</td>
                                <td>${quizList[i].quizID}</td>
                            </tr>
                        `;
        document.querySelector(".dashboardQuizTable").innerHTML += toinsert;
        totalParticipants += current.participantsList.length;
        ++serial;
    }
    document.querySelector(".participantCount").innerHTML = totalParticipants;

    loader.setAttribute("href", "");
}
