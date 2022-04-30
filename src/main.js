import { BaseTransition, callWithErrorHandling, createApp } from 'vue'
import App from './App.vue'
import router from './router.js'
import './index.css'

// createApp(App).use(router).mount('#app')
const user = 'X'
const AI = 'O'
// holder for index of the button we pressed
const btns = []

const main = document.querySelector('.main')
const fragment = document.createDocumentFragment()

// button and interaction
for (let i = 0; i < 9; i++) {
  const btn = document.createElement('div')
  btn.classList.add('btn')
  btn.onclick = () => {
    // only land on empty spots
    if (btn.textContent === ''){
      // user's turn
      btn.textContent = user
      // AI's turn
      runAI()
    }
  }
  btns.push(btn)
  fragment.appendChild(btn)
}
main.appendChild(fragment)

const tools = document.querySelectorAll('span')
tools[1].onclick = () => {
  tools[0].textContent = 'What is coming next?'
  btns.forEach((btn) => (btn.textContent = ''))
}

const runAI = () => {
  // if win
  if (canwin(null,user)) {
    console.log('You Win!')
    tools[0].textContent = 'You Win!'
    return
  }
  // if tie(no free button)
  let end = btns.filter((btn) => btn.textContent === '')
  end = shuffle(end)
  if (end.length === 0) {
    console.log('Tie!')
    tools[0].textContent = 'Tie!'
    return
  }
  // moving strategies
  let win, // ai wins
  block,  // player wins
  other  // random position
  for (var btn of end) {
    // choose the winning spot
    if (canwin(btn, AI)) {
      win = btn
      break
    }else if (canwin(btn, user)) {// else block the winner
      block = btn
      break
    }else {
      other = btn
    }
  }
  // whether to stop
  if (win != null) {
    win.textContent = AI;
    console.log('You lose :(')
    tools[0].textContent = 'You lose :('
  }else if (block != null) {
    block.textContent = AI
  }else {
    other.textContent = AI
  }
}

const canwin = (btn, who) => {
  // place a button
  if (btn != null) {
    btn.textContent = who
  }
  // define winning situations
  let win = 
    match(who, 0, 1, 2) ||
    match(who, 3, 4, 5) ||
    match(who, 6, 7, 8) ||
    match(who, 0, 3, 6) ||
    match(who, 1, 4, 7) ||
    match(who, 2, 5, 8) ||
    match(who, 0, 4, 8) ||
    match(who, 2, 4, 6)
  // revise the former move
  if (btn != null) {
    btn.textContent = ''
  }
  return win
}

// check consecutiveness
const match = (who, index1, index2, index3) => {
  return (
    btns[index1].textContent === who && 
    btns[index2].textContent === who && 
    btns[index3].textContent === who
  )
}

const shuffle = (arr) => {
  const result = []
  let random
  while (arr.length > 0) {
    random = Math.floor(Math.random() * arr.length)
    result.push(arr[random])
    arr.splice(random, 1)
  }
  return result
}

