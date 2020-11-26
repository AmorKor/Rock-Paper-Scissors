import {RPS, RPSLSp} from './data.js'

let choices = []
let compScore = 0
let userScore = 0
let maxScore
let availableOptions

const resultField = document.querySelector('.result')
const compScoreField = document.querySelector('.counter__comp')
const userScoreField = document.querySelector('.counter__user')
const menu = document.querySelector('.menu')
const header = document.querySelector('.header') 
const title = document.querySelector('.title')


// fire setting game options depends on chosen game
const gameButtons = document.querySelectorAll('.menu__button')
gameButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        const maxScoreField = document.querySelector('.scoreSetter')
        
        if(e.target.getAttribute('id') === 'RPS' || e.target.getAttribute('id') === 'RPSLSp') {
            setChoices.call(this)
            nextMenu()
            submitField.call(this)
            
        }
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

function setMaxScore() {
    const input = document.querySelector('#scoreSetter__field')
    maxScore = +input.value
}

// classes manipulations to fire transitions and display the game
function nextMenu() {
    const scoreSetterField = document.querySelector('.scoreSetter')
    const slashSigns = document.querySelectorAll('.slash')

    menu.classList.add('menu--inactive')
    
    setTimeout(function() {
        gameButtons.forEach(button => button.remove())
        slashSigns.forEach(sign => sign.remove())
        scoreSetterField.classList.remove('scoreSetter--inactive')
        menu.classList.remove('menu--inactive')
    }, 600)
}

function submitField() {
    // add sumbit on button
    document.querySelector('.scoreSetter__button').addEventListener('click', () => {
        setMaxScore()
        menu.classList.add('menu--inactive')

        setTimeout(() => {
            startGame.call(this)
        }, 600)
    })
    // add submit on field
    document.querySelector('#scoreSetter__field').addEventListener('keydown', e => {
        if(e.key !== 'Enter') return 
        setMaxScore()
        menu.classList.add('menu--inactive')

        setTimeout(() => {
            startGame.call(this)
        }, 600)
    })
}

// Display game
function startGame() {
    menu.remove()
    header.classList.remove('header--start')
    title.textContent = `${this.textContent}`
    title.classList.add('title__active')
    document.querySelector('.counter').classList.remove('counter--inactive')
    document.querySelector('.options').classList.remove('options--inactive')
    document.querySelector('.game').classList.remove('game--inactive') 
}

// Compare choices, update and check game score
function startRound() {
    console.log(`Comp Score ${compScore} \n User Score: ${userScore}`)  


    const userChoice = this.getAttribute('id')
    const compChoice = choices[
        Math.floor(Math.random() * 10) % choices.length
    ]
    console.log(`Choices: 
    User: ${userChoice}
    Comp: ${compChoice}`)
    
    defineWinner(userChoice, compChoice)  

    if(compScore === maxScore) {
        endGame('Computer')
    } else if(userScore === maxScore) {
        endGame('User')
    }
}

// Show final text
function endGame(winner) {
    title.classList.add('title--anim')
    document.querySelector('.game').classList.add('game--end') 
    
    setTimeout(function() {
        
        header.classList.add('header--start')
        title.classList.add('title--end')
        title.classList.remove('title--anim')
        document.querySelector('.game').remove()        

        if(winner === 'Computer') {
            title.innerHTML = 'End of the game <br> Computer won'
        } else if(winner === 'User') {
            title.innerHTML = 'End of the game <br> User won'
        }
    }, 600)
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
                userWins(userMove, compMove)
            } else {
                compWins(userMove, compMove)
            }
    } else {
        // if choices coeficient differ on more the 1:
        // if differance is even then wins higher
        // if differance is odd then wins lower
        if((Math.abs(userCoefficient-compCoefficient) % 2) === 0) {
            if(userCoefficient > compCoefficient) {
                userWins(userMove, compMove)
            } else {
                compWins(userMove, compMove)
            }
        } else {
            if(userCoefficient > compCoefficient) {
                compWins(userMove, compMove)
            } else {
                userWins(userMove, compMove)
            }
        }
    }
    
}

// Display text on the screen depending on winner
function userWins(user, comp) {
    resultField.textContent = `You (${user.toUpperCase()}) beat the Comp (${comp.toUpperCase()}). Keep it up!`
    resultField.style.color = 'lightgreen'
    userScore++
    userScoreField.textContent = userScore
}

function compWins(user, comp) {
    resultField.textContent = `Comp (${comp.toUpperCase()}) beats You (${user.toUpperCase()}). Do not worry.`
    resultField.style.color = 'red'
    compScore++
    compScoreField.textContent = compScore
}

// console.log(typeof header.clientWidth)

// window.addEventListener('resize', () => {
//     // console.log(header.clientWidth)
//     if(header.clientWidth <= 575) {
//         title.textContent = 'RPLSp'
//         console.log('hello')
//     } else return
// })