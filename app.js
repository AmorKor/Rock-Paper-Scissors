import {RPS, RPSLSp} from './data.js'

let choices = []
let compScore = 0
let userScore = 0
let availableOptions

const resultField = document.querySelector('.result')
const compScoreField = document.querySelector('.counter__comp')
const userScoreField = document.querySelector('.counter__user')

// fire setting game options depends on chosen game
const gameButtons = document.querySelectorAll('.menu__button')
gameButtons.forEach(button => {
    button.addEventListener('click', function() {
        setChoices.call(this)
        startAnimation.call(this)
        // start round after clicking on the available move
        availableOptions.forEach(item => {
            item.addEventListener('click', function() {
                startRound.call(this)
            })
        })
    })
})

// get game setting form data file
// create available moves and append them on page
function setChoices() {
    const gameType = this.getAttribute('id')
    let choicesObjArr
    
    if(gameType === 'RPS') {
        choicesObjArr = Object.values(RPS)
    } else {
        choicesObjArr = Object.values(RPSLSp)
    }
    choices = choicesObjArr.map(choiceObj => {
        return choiceObj.name
    })

    // adding available moves on page
    const optionsContainer = document.querySelector('.options')
    choicesObjArr.forEach(obj => {
        const div = document.createElement('div')
        const img = document.createElement('img')

        div.classList.add('options__item')
        div.setAttribute('id', obj.name)
        img.src = obj.src

        div.appendChild(img)
        optionsContainer.appendChild(div)
    })

    // get node list of newly created available moves
    availableOptions = document.querySelectorAll('.options__item')
    return availableOptions
}

// classes manipulations to fire transitions and display the game
function startAnimation() {
    const header = document.querySelector('.header') 
    const title = document.querySelector('.title')
    const menu = document.querySelector('.menu')

    menu.classList.add('menu--inactive')

    setTimeout(() => {
        menu.remove()
        header.classList.remove('header--start')
        title.textContent = `${this.textContent}`
        title.classList.add('title__active')
        document.querySelector('.counter').classList.remove('counter--inactive')
        document.querySelector('.options').classList.remove('options--inactive')
        document.querySelector('.game').classList.remove('game--inactive') 
    }, 600)
}

function startRound() {
    const userChoice = this.getAttribute('id')
    const compChoice = choices[
        Math.floor(Math.random() * 10) % choices.length
    ]
    console.log(userChoice, compChoice)
    
    defineWinner(userChoice, compChoice)
}

function defineWinner(userMove, compMove) {
    let userCoefficient = choices.indexOf(userMove) + 1
    let compCoefficient = choices.indexOf(compMove) + 1

    if(userCoefficient === compCoefficient) {
        resultField.textContent = `It's draw! Come on!`
        resultField.style.color = 'grey'
    } else if((userCoefficient+1) === compCoefficient || (compCoefficient+1) === userCoefficient) {
        // if choices are standing nearby then wins one that have highter priority coefficient
            if(userCoefficient < compCoefficient) {
                resultField.textContent = `You (${userMove.toUpperCase()}) beat the Comp (${compMove.toUpperCase()}). Keep it up!`
                resultField.style.color = 'lightgreen'
                userScore++
                userScoreField.textContent = userScore
            } else {
                resultField.textContent = `Comp (${compMove.toUpperCase()}) beats You (${userMove.toUpperCase()}). Do not worry.`
                resultField.style.color = 'red'
                compScore++
                compScoreField.textContent = compScore
            }
    } else {
        // if choices coeficient differ on more the 1:
        // if differance is odd then wins lower
        // if differance is even then wins higher
        if((Math.abs(userCoefficient-compCoefficient) % 2) === 0) {
            if(userCoefficient > compCoefficient) {
                resultField.textContent = `You (${userMove.toUpperCase()}) beat the Comp (${compMove.toUpperCase()}). Keep it up!`
                resultField.style.color = 'lightgreen'
                userScore++
                userScoreField.textContent = userScore
            } else {
                resultField.textContent = `Comp (${compMove.toUpperCase()}) beats You (${userMove.toUpperCase()}). Do not worry.`
                resultField.style.color = 'red'
                compScore++
                compScoreField.textContent = compScore
            }
        } else {
            if(userCoefficient > compCoefficient) {
                resultField.textContent = `Comp (${compMove.toUpperCase()}) beats You (${userMove.toUpperCase()}). Do not worry.`
                resultField.style.color = 'red'
                compScore++
                compScoreField.textContent = compScore
            } else {
                resultField.textContent = `You (${userMove.toUpperCase()}) beat the Comp (${compMove.toUpperCase()}). Keep it up!`
                resultField.style.color = 'lightgreen'
                userScore++
                userScoreField.textContent = userScore
            }
        }
    }
    
}
