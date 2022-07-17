var numberOfQuestion = 0;

const addQuestion = document.querySelector("#addQuestion");
const removeQuestion = document.querySelector("#removeQuestion");
const submit = document.querySelector("#submit-btn");
const questionContainer = document.querySelector("#questionContainer");
const form = document.querySelector("form");

function checkValid(){
    var valid = true;
    form.querySelectorAll('[required]').forEach((item) => {
        if(!item.value){
            valid = false;
            return valid;
        }
    })
    return valid;
}

addQuestion.addEventListener("click", () => {
    if(checkValid()){
        const newQuestion = document.createElement("div");
        newQuestion.id = `question-${numberOfQuestion + 1}`;
        newQuestion.innerHTML = `
                                    <label class="form-label mt-4"><strong>Question ${numberOfQuestion + 1}</strong></label>
                                    <div class="form-group">
                                        <textarea class="form-control mb-1 questionText${numberOfQuestion + 1}" required id="exampleTextarea" placeholder="Type Question Here" rows="2"></textarea>
                                        </div>
                                    <div class="form-floating mb-1">
                                        <input class="form-control optionA${numberOfQuestion + 1}" required id="floatingInput" placeholder="name@example.com">
                                        <label for="floatingInput">Option A</label>
                                        </div>
                                    <div class="form-floating mb-1">
                                        <input class="form-control optionB${numberOfQuestion + 1}" required id="floatingInput" placeholder="name@example.com">
                                        <label for="floatingInput">Option B</label>
                                    </div>
                                    <div class="form-floating mb-1">
                                        <input class="form-control optionC${numberOfQuestion + 1}" required id="floatingInput" placeholder="name@example.com">
                                        <label for="floatingInput">Option C</label>
                                    </div>
                                    <div class="form-floating mb-1">
                                        <input class="form-control optionD${numberOfQuestion + 1}" required id="floatingInput" placeholder="name@example.com">
                                        <label for="floatingInput">Option D</label>
                                    </div>
                                    <div class="form-group mb-3 correct-option-selector">
                                        <div class="row>
                                            <div class="col-3"> Correct Option : </div>
                                            <div class="col-auto ms-3">
                                                <select class="form-select correctOption${numberOfQuestion + 1}" id="exampleSelect1">
                                                <option>A</option>
                                                <option>B</option>
                                                <option>C</option>
                                                <option>D</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                `
        questionContainer.appendChild(newQuestion);
        ++numberOfQuestion;
    }
});

removeQuestion.addEventListener("click", () => {
    if(numberOfQuestion > 0) {
        document.querySelector(`#question-${numberOfQuestion}`).remove();
        --numberOfQuestion;
    }
    else{
        alert("Please add a question first.");
    }
});

submit.addEventListener("click", async () => {
    loader.setAttribute("href", "/css/loader.css");

    if(numberOfQuestion == 0){
        alert("Please enter atleast 1 question.");
    }
    else if(checkValid()){
        var questions = [];
        const quizName = document.querySelector(".quizName").value;
        for(var i = 1; i < numberOfQuestion + 1; i++){
            var text = document.querySelector(`.questionText${i}`).value;
            text = text.replace(/(?:\r\n|\r|\n)/g, '<br>');
            var nextQuestion = {
                questionText: text,
                optionA: document.querySelector(`.optionA${i}`).value,
                optionB: document.querySelector(`.optionB${i}`).value,
                optionC: document.querySelector(`.optionC${i}`).value,
                optionD: document.querySelector(`.optionD${i}`).value,
                correctOption: document.querySelector(`.correctOption${i}`).value
            }
            questions.push(nextQuestion);
        }

        const config = {
            url: "/admin/newQuiz/post",
            method: "post",
            data: {
                quizName,
                questions
            }
        }

        const res = await axios(config);
        console.log(res);
        if(res.data.status != "OK"){
            alert("Couldn't submit quiz. Please try again after some time.");
        }
        else{
            location.reload();
        }
    }
    loader.setAttribute("href", null);
});