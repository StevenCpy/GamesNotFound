import { useState, useEffect, useRef, createContext, useContext } from "react"
import GameButton from "./components/GameButton"
import './Hit the Target.css'

const START_TIME_S = 5

const ScoreContext = createContext(null)
const GameStatusContext = createContext(null)

function Target({ playableSize, onTargetHit }) {
    const [targetSize, setTargetSize] = useState({width: 0, height: 0})
    const [pos, setPos] = useState({x: Math.random() * playableSize.width, y: Math.random() * playableSize.height})
    const { setScore } = useContext(ScoreContext)

    const targetRef = useRef(null)

    function handleTargetClicked() {
        // measure current component DOM size
        const currentTargetSize = {width: targetRef.current.clientWidth, height: targetRef.current.clientHeight}
        setTargetSize(currentTargetSize)

        // generate new random (x,y) for target
        setPos({x: Math.random() * (playableSize.width - currentTargetSize.width), y: Math.random() * (playableSize.height - currentTargetSize.height)})
        // increment score
        setScore(prev => prev + 1)
        
        onTargetHit() // refresh playableArea to get new window dimension in case it was resized
    }

    return (
        <button id="target" ref={targetRef} onClick={ handleTargetClicked }
        style={{
            left: pos.x,
            top: pos.y
        }}>
            🎯
        </button>
    )
}

function Timer({ onTimerEnd }) {
    const [timeSeconds, setTimeSeconds] = useState(START_TIME_S)
    const { isGameOn, setIsGameOn, setIsGameOver } = useContext(GameStatusContext)

    useEffect(() => {
        if (!isGameOn) return // only start timer when "START" button is clicked

        const interval = setInterval(() => setTimeSeconds(prev => prev-1), 1000)

        return () => clearInterval(interval)
    }, [isGameOn])

    useEffect(() => {
        if (timeSeconds == 0) {
            onTimerEnd()
            setTimeSeconds(START_TIME_S) // reset timer for next game
        }
    }, [timeSeconds])

    return (
        <>
            Timer: {timeSeconds}s
        </>
    )
}

function HittheTarget({ submitScore }) {
    const [score, setScore] = useState(0)
    const [playableSize, setPlayableSize] = useState({width: 0, height: 0})
    const [refresh, setRefresh] = useState(0)
    const [isGameOn, setIsGameOn] = useState(false)
    const [isGameOver, setIsGameOver] = useState(false)

    const playableAreaRef = useRef(null)

    useEffect(() => {
        setPlayableSize({width: playableAreaRef.current.clientWidth, height: playableAreaRef.current.clientHeight})
    }, [refresh])

    function StartScreen() {
        return (
            <div id="start-screen">
                <GameButton onClick={() => setIsGameOn(true)} text="START" />
            </div>
        )
    }

    function GameOverScreen() {
        return (
            <div id="gameover-screen">
                Final Score: {score}
                <GameButton onClick={() => {setIsGameOver(false); setIsGameOn(true); setScore(0)}} text="Play again"/>
            </div>
        )
    }

    function handleOnTimerEnd() {
        setIsGameOn(false) // ends game
        setIsGameOver(true) // show "Game Over" screen
        submitScore(score) // submit score to server
    }

    return (
        <GameStatusContext value={{ isGameOn, setIsGameOn, setIsGameOver }}>
            <ScoreContext value={{ setScore }}>
                <div id="playable-area" ref={playableAreaRef}>
                    <div id="score-timer-container">
                        <span>Score: {score}</span>
                        <span><Timer onTimerEnd={ handleOnTimerEnd } /></span>
                    </div>
                    {isGameOn ? 
                        <Target playableSize={playableSize} onTargetHit={() => setRefresh(refresh+1)} />
                        :
                        <>
                            {isGameOver ? <GameOverScreen /> : <StartScreen />}
                        </>
                    }
                </div>
            </ScoreContext>
        </GameStatusContext>
    )
}

export default HittheTarget