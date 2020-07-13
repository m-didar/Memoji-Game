'use strict'

let cardsList = Array.from(document.querySelectorAll('.card'));

// RANDOM

function randomize () {
  let randoms = [];
  while(randoms.length < 12){
    let num = Math.floor(Math.random() * 12);
    if (randoms.indexOf(num) == -1){
      randoms.push(num);
    }
  }

  let i = 0;
  cardsList.forEach(card => card.style.setProperty('--order', randoms[i++]));
};

randomize();

//Timer
let timerContainer = document.querySelector('.timer');
let time = 60;
setTime(time);

function setTime(value) {
  let min = Math.floor(value / 60);
  min = min > 9 ? String(min) : '0' + min;
  let sec = value % 60;
  sec = sec > 9 ? String(sec) : '0' + sec;
  timerContainer.firstElementChild.innerText = min;
  timerContainer.lastElementChild.innerText = sec;
}

let popup = document.querySelector('.popup');
let popupLetters = Array.from(popup.firstElementChild.firstElementChild.children);
console.log(popupLetters);

function timerFunc() {
  setTime(time - 1);
  if(time === 0){
    clearInterval(Timer);
    let message = 'Lose';
    popupLetters.map(span => {
      if (message[0]){
        span.innerText = message[0];
        message = message.substr(1);
      } else{
        span.innerText = '';
      }
    });
    popup.firstElementChild.lastElementChild.innerText = 'Try again';
    popup.style.visibility = 'visible';
  }
  time--;
}

// OnCLICK
let selectedCounter = 0;
let matchedPairs = 0;
cardsList.forEach(card => card.addEventListener('click', flip));

let timeStarted = false;
let Timer;

function flip (event) {
  if (!timeStarted){
    Timer = setInterval(timerFunc, 1000);
    timeStarted = true;
  }

  //if 2 cards opened -> close them on new click
  if (selectedCounter === 2){
    document.querySelectorAll('[data-selected]').forEach(selectedCard => {
      selectedCard.removeAttribute('data-selected');
      if (!selectedCard.classList.contains('match')) selectedCard.classList.remove('flip');
      selectedCard.classList.remove('wrong');
      selectedCounter = 0;
    });
  };

  let target= event.currentTarget;
  if (target.classList.contains('flip')){
    target.classList.remove('flip');
    target.removeAttribute('data-selected');
    selectedCounter--;
  } else{
    target.classList.add('flip');
    target.setAttribute('data-selected', 'true');
    selectedCounter++;
  };

  //check if two opened cards match
  if (selectedCounter === 2){
    let selectedCards = document.querySelectorAll('[data-selected]');
    if (selectedCards[0].lastElementChild.innerText === selectedCards[1].lastElementChild.innerText){
      selectedCards.forEach(card => {
        card.classList.add('match');
        card.removeEventListener('click', flip);
        matchedPairs++;
      });
    } else{
      selectedCards.forEach(card => card.classList.add('wrong'));
    }
  };

  //win popup if all pairs found
  if (matchedPairs === 12){
    clearInterval(Timer);
    let message = 'Win';
    popupLetters.map(span => {
      if (message[0]){
        span.innerText = message[0]
        message = message.substr(1);
      } else{
        span.innerText = '';
      }
    });
    popup.firstElementChild.lastElementChild.innerText = 'Play again';
    popup.style.visibility = 'visible';
  }
};

let button = document.querySelector('.popup-btn');
button.addEventListener('click', newGame);

function newGame () {
  popup.style.visibility = 'hidden';
  timeStarted = false;
  time = 60;
  setTime(60);
  matchedPairs = 0;
  selectedCounter = 0;
  randomize();
  cardsList.map(card => {
    card.classList.remove('flip');
    card.classList.remove('match');
    card.classList.remove('wrong');
    card.removeAttribute('data-selected');
    card.addEventListener('click', flip);
  })
}