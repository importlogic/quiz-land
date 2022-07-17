// -----Prevent right click -------
document.addEventListener("contextmenu", function (e){
    e.preventDefault();
}, false);

const quizidHolder = document.querySelector("#shortId");
const usernameHolder = document.querySelector("#userName");
const quizidDiv = document.querySelector(".quizidInput");
const usernameDiv = document.querySelector(".usernameInput");
const startQuizDiv = document.querySelector(".startQuizInput");
const startQuiz = document.querySelector(".startQuiz");
const validateID = document.querySelector(".validateID");
const validateUsername = document.querySelector(".validateUsername");
const errorMessage = document.querySelector(".error");
const okMessage = document.querySelector(".okValidate");
const loader = document.querySelector("#loaderEnabler");

var username = "";

if(invite != ""){
    quizidHolder.value = invite;
}

validateID.onclick = async () => {
    loader.setAttribute("href", "/css/loader.css");
    invite = quizidHolder.value;

    const config = {
        url: "/api/validator/id",
        method: "post",
        data: {
            quizID: invite
        }
    }
    const response = await axios(config);

    loader.setAttribute("href", "");

    if(response.data.status == "OK"){
        if(response.data.isLive){
            okMessage.innerHTML = "Invite Code verified. Please enter username.";
            okMessage.classList.remove("hidden");
            quizidDiv.classList.add("hidden");
            usernameDiv.classList.remove("hidden");
        }
        else{
            errorMessage.innerHTML = "Cannot enter the Quiz. It has been ended by Admin.";
            errorMessage.classList.remove("hidden");
            setTimeout(() => {
                errorMessage.classList.add("hidden");
            }, 5 * 1000);
        }
    }
    else{
        errorMessage.innerHTML = "Invite Code Invalid or Expired";
        errorMessage.classList.remove("hidden");
        setTimeout(() => {
            errorMessage.classList.add("hidden");
        }, 5 * 1000);
    }
}

validateUsername.onclick = async () => {
    loader.setAttribute("href", "/css/loader.css");
    username = usernameHolder.value;
    const config = {
        url: "/api/validator/username",
        method: "post",
        data: {
            quizID: invite,
            username
        }
    }

    const response = await axios(config);

    loader.setAttribute("href", "");

    if(response.data.status == "OK"){
        okMessage.innerHTML = "Username Valid. You are ready to start the quiz.";
        okMessage.classList.remove("hidden");
        usernameDiv.classList.add("hidden");
        startQuizDiv.classList.remove("hidden");
    }
    else{
        errorMessage.innerHTML = "Username already taken. Please pick a different username.";
        errorMessage.classList.remove("hidden");
        setTimeout(() => {
            errorMessage.classList.add("hidden");
        }, 5 * 1000);
    }
}

startQuiz.onclick = () => {
    loader.setAttribute("href", "/css/loader.css");
    document.querySelector(".mainForm").submit();
    location.reload();
}

