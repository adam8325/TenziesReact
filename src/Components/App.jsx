import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App() {

    // State

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [rollCount, setRollCount] = React.useState(0)
    const [diceTimer, setDiceTimer] = React.useState(0)
    const [timerStarted, setTimerStarted] = React.useState(false);

    // Effects
    
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
            setTimerStarted(false)
        }
    }, [dice])

    React.useEffect(() => {
        let interval = ""

        if (timerStarted) {
         interval = setInterval(() =>
            setDiceTimer(prevState => prevState + 1), 1000);
        }
        return () => clearInterval(interval);

    }, [timerStarted])

    // Functions

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }

    
    function rollDice() {

        if (!timerStarted) {
            setTimerStarted(true); 
          }

        if(!tenzies) {
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
            setRollCount(oldCount => oldCount + 1)
        } else {
            setTenzies(false)
            setDice(allNewDice())
            setRollCount(0)
            setDiceTimer(0)
            setTimerStarted(false)
        }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }

    // Render
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))

    const styles = {
        textDecoration: tenzies? "underline" : "" 
    }
    
    return (
        <main>
            {tenzies && <Confetti />}
            <div className="header">
                <h1 className="title">Tenzies</h1>
                <div className="dice-stats">
                    <p>Rolls:<span style={styles}>{rollCount}</span></p>
                    <p>Time:<span style={styles}>{diceTimer}</span></p>
                </div>
            </div>
            
            <p className="instructions">Click each die to freeze it at its current value between rolls.
                <br></br>Roll until all dice are the same. 
            </p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
        </main>
    )
}