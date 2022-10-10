//Declare variables for relevant elements
var choicesOptions = document.querySelector('#choicesOptions');
var startMenu = document.getElementById('startMenu');
var questionHeader = document.getElementById('questionHeader');
var gameClock = document.getElementById('gameClock');
var initialsForm = document.getElementById('initialsForm');
var initialsInput = document.getElementById('initialsInput');
var submitInitialsBtn = document.getElementById('submitInitialsBtn');
var highScoresLink = document.getElementById('highScoresLink');
var backToStart = document.getElementById('backToStart');
var highScoresList = document.getElementById('highScoresList');

// Set start variables for question number, number of questions, and question choices
var questionNumber = 0;
var totalQuestions = questions.length;
var questionChoices = questions[questionNumber].choices;
console.log("Question Choices: " + questionChoices);

//Create timer variable and set the total amount of time based on the number of questions
var clockTime = totalQuestions * 10;

//Create variable for final score and an empty array of high scores
var finalScore;
var highScores = [];

//Run function renderHighScores() to see if there are an existing high scores in local storage
renderHighScores();

function renderHighScores() {
    var savedHighScores = localStorage.getItem("high scores");

    if (savedHighScores === null) {
        return;
    }

    var scoresObject = JSON.parse(savedHighScores);
    console.log("Saved High Scores: " + savedHighScores);
    highScores = scoresObject;
}

//Creates a function for when user clicks the "Start Quiz" button
function startQuiz() {
    console.log("Question #: " + questionNumber);

    //Hide the initial start display
    startMenu.setAttribute("style", "display: none;");
    highScoresLink.setAttribute("style", "display: none;");
    initialsForm.setAttribute("style", "display: none;");
    highScoresLink.setAttribute("style", "display: none;");
    choicesOptions.setAttribute("style", "display: block;");
    choicesOptions.innerHTML = " ";

    //Start clock countdown
    countdownClock();

    //Replace original 'Javascript Quiz Challenge' header with question 1 and create buttons for each of its answers
    listQuestion();
}

//Creates a function that loops through the possible answers for each question and creates a button for each answer
function listQuestion() {
    //Update question title
    questionHeader.textContent = questions[questionNumber].title;
    //Update question choices and create buttons
    for (var i = 0; i < questionChoices.length; i++) {
        var choiceBtn = document.createElement("button");
        choiceBtn.setAttribute("class", "btn btn-outline-dark btn-lg d-block my-2 choice-btn");
        choiceBtn.setAttribute("id", "choice-" + i);
        choiceBtn.textContent = questions[questionNumber].choices[i];
        choicesOptions.appendChild(choiceBtn);
    }
}

//Creates a function for clock countdown
function countdownClock() {
    var clockTick = setInterval(function() {
        //Decrease the clockTime variable every second and update the display
        gameClock.textContent = clockTime;
        clockTime--;

        //End the game if the clock hits 0
        if (clockTime <= 0) {
            clearInterval(clockTick);
            gameClock.textContent = "0";
            choicesOptions.innerHTML = " ";
            choicesOptions.setAttribute("style", "display: none;");
            startMenu.setAttribute("style", "display: block;");
            questionNumber = 0;
            questionHeader.textContent = "Your score is: " + clockTime;
            clockTime = totalQuestions * 10;
        }
        //Stop the clock if user gets through all the questions and reset stats so user can restart
        else if (questionNumber === totalQuestions) {
            clearInterval(clockTick);
            questionNumber = 0;
            clockTime = totalQuestions * 10;
        }
    }, 1000);
}

//Creates a function that notifies the user they chose the correct answer
function correctAnswer() {
    var correctNotification = document.createElement("section");
    correctNotification.setAttribute("class", "border-top mt-4 pt-4");
    correctNotification.setAttribute("style", "font-size: 16px; color: green; font-weight: bold;");
    correctNotification.textContent = "You selected the correct answer!";
    choicesOptions.appendChild(correctNotification);
}

//Creates a function that notifies the user they chose an incorrect answer
function incorrectAnswer() {
    var incorrectNotification = document.createElement("section");
    incorrectNotification.setAttribute("class", "border-top mt-4 pt-4");
    incorrectNotification.setAttribute("style", "font-size: 16px; color: red; font-weight: bold;");
    incorrectNotification.textContent = "You selected an incorrect answer";
    choicesOptions.appendChild(incorrectNotification);
}

//Create an event listener with a function to evaluate whether or not the user has chosen the correct answer and notifies them/moves on to the next question
document.addEventListener("click", function(event) {
    if (event.target.matches(".choice-btn")) {
        console.log(event.target.textContent);
        event.stopPropagation();
        event.preventDefault();
        //Correct answer condition
        if (event.target.textContent === questions[questionNumber].answer) {
            //Move on to the next question and add time to the game clock
            questionNumber = questionNumber + 1;
            clockTime = clockTime + 5;
            
            //Checks if there are any more questions and if so clears button contents/creates new question/answers and notifies the user if they got the answer right/wrong
            if (questionNumber <= totalQuestions-1) {
                choicesOptions.innerHTML = " ";
                listQuestion();
                correctAnswer();
            } else {
                //End quiz and notify user of correct answer on last question
                choicesOptions.innerHTML = " ";
                correctAnswer();
                //Display initials input form to allow user to enter high score
                initialsForm.setAttribute("style", "display: block;");
                //Allow user to restart quiz and display their final score
                startMenu.setAttribute("style", "display: block;");
                highScoresLink.setAttribute("style", "display: inline;");
                questionHeader.textContent = "Your score is: " + clockTime;
                finalScore = clockTime;
            }    
        }
        else if (event.target.textContent !== questions[questionNumber].answer) {
            //Move on to the next question and add time to the game clock
            questionNumber = questionNumber + 1;
            clockTime = clockTime - 10;

            //Checks if there are any more questions and if so clears button contents/creates new question/answers and notifies the user if they got the answer right/wrong
            if (questionNumber <= totalQuestions-1) {
                choicesOptions.innerHTML = " ";
                listQuestion();
                incorrectAnswer();
            } else {
                //End quiz and notify user of correct answer on last question
                choicesOptions.innerHTML = " ";
                incorrectAnswer();
                //Display initials input form to allow user to enter high score
                initialsForm.setAttribute("style", "display: block;");
                //Allow user to restart quiz and display their final score
                startMenu.setAttribute("style", "display: block;");
                highScoresLink.setAttribute("style", "display: inline;");
                questionHeader.textContent = "Your score is: " + clockTime;
                finalScore = clockTime;
            }
        }     
    }
});