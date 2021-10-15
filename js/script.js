'use strict';

//////////////////
// ELEMENTS
const iconsElm = document.querySelectorAll('.icon-container');
const gameContainerElm = document.querySelector('.game-container');
const winContainerElm = document.querySelector('.win-container');
const scoreElm = document.querySelector('.score');
const winMsgElm = document.querySelector('.win-message');
const restartBtn = document.querySelector('.restart-btn');
const timerElm = document.querySelector('.timer');

//////////////////
// GLOBAL VARIABLES
let curIcons = [];
let atts = [];
let matchScore = 0;
let score = 0;
let clicks = 0;
const time = 60;

/////////////////////////////////
//CHECK IF ALL ITEMS ARE THE SAME
const allEqual = arr => arr.every(val => val === arr[0]);

//////////////////
//GET RANDOM ORDERS
function shuffle(array) {
  let i = array.length,
    j = 0,
    temp;
  while (i--) {
    j = Math.floor(Math.random() * (i + 1));
    // swap randomly chosen element with current element
    temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

const genRandomNums = function (start, limit) {
  const arr = [];
  for (let i = start; i <= limit; i++) {
    arr.push(i);
  }
  return shuffle(arr);
};

const getRandomOrders = function () {
  const randomNums = genRandomNums(1, iconsElm.length);
  iconsElm.forEach(e => {
    e.style.order = randomNums[0];
    randomNums.shift();
  });
};

//////////////////
//REVEAL and HIDE

const reveal = function (e) {
  e.classList.add('reveal');
};

const hide = function (e) {
  e.classList.remove('reveal');
};

const revealIcon = function (e) {
  e.classList.add('flip');
  e.childNodes[1].classList.add('reveal');
  e.style.pointerEvents = 'none';
};
const hideIcon = function (e) {
  e.classList.remove('flip');
  e.childNodes[1].classList.remove('reveal');
  e.style.backgroundColor = '#264653';
  e.style.pointerEvents = 'auto';
};

//////////////////
//MATCH and NOT MATCH

const isMatch = function () {
  matchScore++;
  setTimeout(() => {
    curIcons.forEach(e => {
      e.style.backgroundColor = '#0b7285';
    });
  }, 700);
};

const notMatch = function () {
  setTimeout(() => {
    curIcons.forEach(e => (e.style.backgroundColor = '#A63F4B'));
  }, 500);
  setTimeout(() => {
    curIcons.forEach(e => (e.style.backgroundColor = '#264653'));
    curIcons.forEach(e => hideIcon(e));
  }, 800);
};

//////////////////
// WIN or LOSE

const win = function (result) {
  let bgColor, msg;
  if (result) {
    bgColor = '#3fa79a';
    msg = 'You Win!';
    score++;
  } else {
    bgColor = '#A63F4B';
    msg = 'You Lose!';
  }
  scoreElm.textContent = score;
  stopTimer();
  setTimeout(() => {
    winContainerElm.classList.add('reveal');
    winMsgElm.classList.add('reveal');
    restartBtn.classList.add('reveal');
    winContainerElm.style.backgroundColor = bgColor;
    winMsgElm.textContent = msg;
  }, 200);
};

//////////////////
// RESTART

const restart = function () {
  curIcons = [];
  atts = [];
  matchScore = 0;
  clicks = 0;
  countDown = time;
  getRandomOrders();
  timerElm.textContent = formatTime(time);
};

///////////
//TIMER

const formatTime = function (time) {
  let secs = time % 60;
  let mins = Math.floor(time / 60);
  secs < 10 ? (secs = secs.toString().padStart(2, '0')) : secs;
  mins < 10 ? (mins = mins.toString().padStart(2, '0')) : mins;
  return `${mins}:${secs}`;
};

let countDown = time;
let interval;
const startTimer = function () {
  interval = setInterval(() => {
    countDown--;
    timerElm.textContent = formatTime(countDown);
    if (countDown === 0) {
      clearInterval(interval);
      win(false);
    }
  }, 1000);
};

const stopTimer = () => clearInterval(interval);

//////////////////
// EVENT LISTENERS

restart();

iconsElm.forEach(e => {
  e.addEventListener('click', () => {
    // Start timer
    clicks++;
    clicks === 1 ? startTimer() : clicks;
    // Check previous icon
    if (curIcons.length < 2) {
      const att = e.childNodes[1].getAttribute('type');
      curIcons.push(e);
      atts.push(att);
      // console.log(curIcons);

      // Check if match
      if (curIcons.length === 2) {
        allEqual(atts) ? isMatch() : notMatch();
        setTimeout(() => {
          curIcons = [];
          atts = [];
        }, 1100);
      }

      // Check if WIN or LOSE // iconsElm.length / 2
      if (matchScore === iconsElm.length / 2) {
        win(true);
      }
      revealIcon(e);
    }
  });
});

restartBtn.addEventListener('click', () => {
  restart();
  iconsElm.forEach(e => hideIcon(e));
  setTimeout(() => {
    timerElm.textContent = formatTime(time);
    hide(winContainerElm);
  }, 520);
});
