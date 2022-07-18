// -----Prevent right click -------
document.addEventListener("contextmenu", function (e){
    e.preventDefault();
}, false);


// prevent refresh 
document.addEventListener('keydown', (e) => {
    e = e || window.event;
    if(e.keyCode == 116 || e.ctrlKey && e.keyCode == 82 || e.keyCode == 122){
        e.preventDefault();
    }
});


const redirector = document.querySelector("#redirectorDummy");
const redirectorUrl = document.querySelector("#redirectorUrl");
const loaderEnabler = document.querySelector("#loaderEnabler"); 
const question = document.querySelector(".question");
const optA = document.querySelector(".optA");
const optB = document.querySelector(".optB");
const optC = document.querySelector(".optC");
const optD = document.querySelector(".optD");
const nextBtn = document.querySelector(".nextBtn");
const answer = document.querySelector(`#answer`);
const fullScreenToggle = document.querySelector(`#fullScreenToggle`);
const bodyEle = document.documentElement;
const quizData = eval(response);
var btnArr = ["A","B","C","D"];

const questionsList = quizData.questions;
var questionsDone = 0;


const quizID = quizData.quizID;

var timeLeft = 0;

const myModal = new bootstrap.Modal(document.querySelector("#exampleModalCenter"));

document.querySelector("#leaderboardButton").addEventListener("click", () => {
    redirectorUrl.value = `/quiz/leaderboard/${quizID}?watch=${username}`;
    redirector.submit();
    window.close();
})

if(quizData.timerState){
    document.querySelector(".timer").classList.remove("hidden");
    timeLeft = quizData.timerValue;
    refreshTimer();
}

async function refreshTimer(){
    var hours = Math.floor(timeLeft / 3600);
    var minutes = Math.floor(timeLeft / 60) % 60;
    var seconds = timeLeft % 60;

    hours = "0" + hours;
    if(minutes < 10) minutes = "0" + minutes;
    if(seconds < 10) seconds = "0" + seconds;

    var currentTime = `${minutes} : ${seconds}`;
    if(hours != 0) currentTime = `${hours} : ` + currentTime;

    document.querySelector("#timeLeft").innerHTML = currentTime;

    --timeLeft;

    if(timeLeft == -1){
        localStorage.setItem(`submitted-${quizID}-${username}`, "true");
        myModal.show();
    }
    else{
        setTimeout(refreshTimer, 1000);
    }
}


btnArr.forEach(button => {
    document.querySelector(`#${button}`).addEventListener('click',()=>{
        btnArr.forEach(btn => {
            document.querySelector(`#${btn}`).classList.remove("okActive");
        })
        document.querySelector(`#${button}`).classList.add("okActive");
        answer.value = button;
    });
});

fullScreenToggle.addEventListener('click',()=>{
    console.log(document.fullscreenElement)
    if (document.fullscreenElement) {
        document.exitFullscreen()
        .then(() => console.log("Document Exited from Full screen mode"))
        .catch((err) => console.error(err));
        fullScreenToggle.innerHTML = `<i class="fa-solid fa-expand"></i>`;
      }
      else {
        document.documentElement.requestFullscreen();
        fullScreenToggle.innerHTML = `<i class="fa-solid fa-compress"></i>`;
      }
})

document.querySelector(".quiz-title").innerHTML = quizData.quizName;

setNextQuestion();

function setNextQuestion(){
    question.innerHTML = questionsList[questionsDone].questionText;
    optA.innerHTML = `<i class="fa-solid fa-square"></i>${questionsList[questionsDone].optionA}<i class="fa-solid fa-circle-check"</i>`;
    optB.innerHTML = `<i class="fa-solid fa-circle"></i>${questionsList[questionsDone].optionB}<i class="fa-solid fa-circle-check"</i>`;
    optC.innerHTML = `<i class="fa-solid fa-play"></i>${questionsList[questionsDone].optionC}<i class="fa-solid fa-circle-check"</i>`;
    optD.innerHTML = `<i class="fa-solid fa-diamond"></i>${questionsList[questionsDone].optionD}<i class="fa-solid fa-circle-check"</i>`;
}

nextBtn.addEventListener("click", async (event) => {
    var submitted = localStorage.getItem(`submitted-${quizID}-${username}`);
    if(submitted == null) submitted = "false";

    if(submitted == "true"){
        redirectorUrl.value = `/quiz/leaderboard/${quizID}?watch=${username}`;
        redirector.submit();
        return;
    }

    loaderEnabler.setAttribute("href", "/css/loader.css");

    const config = {
        url: `/api/update-leaderboard/${quizID}`,
        method: "post",
        data: {
            username, 
            questionID: questionsList[questionsDone]._id,
            userResponse: answer.value
        }
    };

    const axiosResponse = await axios(config);

    loaderEnabler.setAttribute("href", "");

    btnArr.forEach((button) => {
        document.querySelector(`#${button}`).classList.remove("okActive");
    });
    answer.value = "";

    if(axiosResponse.data.status != "OK"){
        alert("There was some error in submitting response. Please try again in a while.");
    }
    else{
        ++questionsDone;

        if(questionsDone == questionsList.length){
            localStorage.setItem(`submitted-${quizID}-${username}`, "true");
            myModal.show();
        }
        else {
            setNextQuestion();
        }
    }
})
