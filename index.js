const boxScore = document.querySelector('.box-score');
const correct = document.querySelector('.correct');
const total = document.querySelector('.total');
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const userScore = urlParams.get('score');
const totalQuestions = urlParams.get('total');

if(!userScore) {
  boxScore.style.display = 'none';
} else {
  correct.textContent = userScore;
  total.textContent = totalQuestions;
}


// rotate background colors
const body = document.querySelector('body');
let degree = 0;
function animate() {
  degree += 5;
  body.style.background = 'linear-gradient(' + degree + 'deg, #3EECAC 0%, #EE74E1 100%)';
}
setInterval(animate,200);