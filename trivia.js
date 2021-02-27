    // get user difficulty choice
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const userLevel = urlParams.get('difficulty');

    const tabs = document.querySelectorAll('.selection');
    const question = document.querySelector('.question-container h2');
    const options = Array.from(document.querySelectorAll('.selection-answer'));
    const scoreboard = document.querySelector('.score');
    const questionTotal = document.querySelector('.question-total');
    const whichQuestion = document.querySelector('.question-number');

    let questionList = [];  
    let questionNumber = 0;
    let score = 0;
    let currentQuestion = {};
    let lockedGame = true;
    let answer; 

    function generateList(data) {
      questionList = [...data.results];
    }

    async function generateEasyQuiz(event) {
      const response = await fetch('https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple');
      const data = await response.json();
      generateList(data);
    }

    async function generateMediumQuiz(event) {
      const response = await fetch('https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple');
      const data = await response.json();
      generateList(data);
    }
    
    async function generateHardQuiz(event) {
      const response = await fetch('https://opentdb.com/api.php?amount=10&category=9&difficulty=hard&type=multiple');
      const data = await response.json();
      generateList(data);
    }

    function wait(ms = 0) {
      return new Promise(resolve => {
        setTimeout(resolve, ms);
      });
    }

    // create random number between 0 and 3     
    function randomNumber() {
      return Math.floor(Math.random() * 4);
    }
        
    // randomly insert correct answer into answer array
    function randomOrder() {
      const correctAnswer = currentQuestion.correct_answer;
      const possibleAnswers = currentQuestion.incorrect_answers;
      possibleAnswers.splice(randomNumber(), 0, correctAnswer);
      return possibleAnswers;
    }

    function askQuestion() {
      lockedGame = false; // unlock game when ask question
      whichQuestion.innerHTML = questionNumber + 1;

      currentQuestion = questionList[questionNumber];
      question.innerHTML = currentQuestion.question;

      const questionOrder = randomOrder();
      options.forEach(option => {
        const number = option.dataset["option"];
        option.innerHTML = questionOrder[number - 1];
      });

      questionNumber++;
    }


    async function handleClick(event) {
      if(lockedGame) return; // if game locked, ignore click
      lockedGame = true; // locks game if clicked

      const selected = event.target.parentElement;
      selected.classList.add('selected');
      if(event.target.textContent === currentQuestion.correct_answer) {
        this.classList.add('correct');
        score++;
        scoreboard.textContent = score;
        await wait(1500);
        this.classList.remove('correct');
      } else {
        this.classList.add('wrong');
        
        options.forEach(option => {
          if(currentQuestion.correct_answer === option.textContent) {
            answer = option;
            answer.classList.add('correct');
          }
        })
        await wait(1500);
        answer.classList.remove('correct');
        this.classList.remove('wrong');
      }

      if(questionNumber < questionList.length) {
        askQuestion();
      } else {
        console.log('done');
        // END GAME
        var myVariable = 'good job, guy';
        window.open("index.html?score=" + score + "&total=" + questionList.length, "_self");
      }
    }
 
    // return tab to original state after transform transition completes
    function removeTransition(e) { 
	    if(e.propertyName !== 'transform') return;
	    this.classList.remove('selected');
    }

    options.forEach(option => option.addEventListener('click', handleClick));
    tabs.forEach(tab => tab.addEventListener('transitionend', removeTransition));

    async function playTrivia() {
      if(userLevel === "easy") { await generateEasyQuiz() };
      if(userLevel === "medium") { await generateMediumQuiz() };
      if(userLevel === "hard") { await generateHardQuiz() };
      if(userLevel === "anime") { await generateAnimeQuiz() };
      // await generateEasyQuiz();

      questionNumber = 0;
      score = 0;
      questionTotal.textContent = questionList.length;
      askQuestion();
    }




    playTrivia();