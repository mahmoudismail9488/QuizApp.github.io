// main 3 containers
const settingsBox = document.getElementById("settings")
const questionsBox = document.getElementById("questions")
const ResultBox = document.getElementById("result")
const progressBar = document.getElementById("boxes")
const nextButton = document.getElementById("next")
const questionsCounter = document.getElementById("questions-number")
const quizResult = document.getElementById("quiz-result")
const retake = document.getElementById("retake")
let questionNumber = 0
let correct = 0
let wrong = 0
// fetch the settings from the json file
const selections = document.getElementById("type-selections")
const levels = document.getElementById("level-selections")
const number = document.getElementById("number-selections")
async function mySettings(){
    const myResponse = await fetch("./openapi.json")
    const settings =myResponse.json();
    const myComponents=settings.then((a)=>{
        // get the types of qustions and create options in select element
        const categories = a.components.schemas.Category.enum
        categories.forEach(element => {
            const option = document.createElement("option")
            option.setAttribute("class","option-style")
            option.textContent = element
            selections.appendChild(option)
        });
        // get the difficulty of qustions and create options in select element
        const difficulties = a.components.schemas.BaseQuestion.properties.difficulty.enum
        difficulties.forEach(level => {
            const option = document.createElement("option")
            option.setAttribute("class","option-style")
            option.textContent = level
            levels.appendChild(option)
        });
    })
}
document.addEventListener("load",mySettings())
// submit settings and call the api to get the questions
let myQuestions = []
const submitButton = document.getElementById("submit-settings")
const myHeader = document.getElementById("header")
const questionHeader = document.getElementById("question")
const radioInputs = document.getElementsByClassName("form-check")


async function check(){
    settingsBox.style.display = "none"
    const mycategories=selections.options[selections.selectedIndex].text
    const mylevels =  levels.options[levels.selectedIndex].text
    const mynumber =  number.options[number.selectedIndex].text
    const myQuestionsResponse = await fetch(`https://the-trivia-api.com/api/questions?categories=${mycategories}&limit=${mynumber}&difficulty=${mylevels}`)
    const returnedQuestions = await myQuestionsResponse.json();
    myQuestions = returnedQuestions
    questionsCounter.textContent = `${questionNumber+1}/${myQuestions.length}`
    const answers = [myQuestions[0].correctAnswer,...myQuestions[0].incorrectAnswers]
    myHeader.textContent = `${mycategories.toUpperCase()} QUIZ`
    questionsBox.style.display = "block"
    questionHeader.textContent = myQuestions[0].question
    for(let i=0;i<answers.length;i++){
        radioInputs[i].innerHTML=`<input class="form-check-input" type="radio" name="flexRadioDefault" id='${answers[i]}' ></input>
        <label class="form-check-label answers" for='${answers[i]}'>${answers[i]}</label>`
    }

}
submitButton.addEventListener("click",check)
// display the questions 


function nextQuestion(){
    
    // check the answer correct or wrong
    const progressBarWidth = progressBar.offsetWidth
    const checked = document.querySelector("input[name='flexRadioDefault']:checked")
    const newStep=document.createElement("div")
    newStep.setAttribute("class","step")
    progressBar.appendChild(newStep)
    const currentQuestion = document.getElementsByClassName("step")[questionNumber]
    currentQuestion.style.width = `${(1/myQuestions.length)*progressBarWidth}px`
    if(checked != null){
       if(checked.id === myQuestions[questionNumber].correctAnswer){
        correct +=1
        currentQuestion.style.backgroundColor = "green"
       }else{
        wrong+=1
        currentQuestion.style.backgroundColor = "red"
       }
       questionNumber+=1
       // check if we finished the questions or not
       
       if(questionNumber === myQuestions.length){
        let resultWord = ""
        const resultNumber = Math.round(correct/myQuestions.length*100)
        questionsBox.style.display ="none"
        ResultBox.style.display = "block" 
        if(resultNumber>=80){
            resultWord = `Congratulations your result: ${resultNumber}%`
        }else{
            resultWord = `Your result: ${resultNumber}%`
        }
        quizResult.textContent = resultWord


       }else{
        //display question number
        questionsCounter.textContent = `${questionNumber+1}/${myQuestions.length}`
        // go to the second question
        const answers = [myQuestions[questionNumber].correctAnswer,...myQuestions[questionNumber].incorrectAnswers]
        questionHeader.textContent = myQuestions[questionNumber].question
        for(let i=0;i<answers.length;i++){
            radioInputs[i].innerHTML=`<input class="form-check-input" type="radio" name="flexRadioDefault" id='${answers[i]}' ></input>
            <label class="form-check-label answers" for='${answers[i]}'>${answers[i]}</label>`
            
        }
       }
    

    }
    
}
nextButton.addEventListener("click",nextQuestion)

// retake button event listner to get the questions setting again
retake.addEventListener("click",()=>{
    location.reload()
})






















