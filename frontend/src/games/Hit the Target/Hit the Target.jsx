import { useState, useEffect, useRef, createContext, useContext } from "react"
import GameButton from "./components/GameButton"
import './Hit the Target.css'

const START_TIME_S = 30

const GameStatusContext = createContext(null)

function Target({ playableAreaSize, onTargetHit }) {
    const [targetSize, setTargetSize] = useState({width: 0, height: 0})
    const [pos, setPos] = useState({x: 0, y: 0})

    const targetRef = useRef(null)

    // watch for target resize when window resizes
    useEffect(() => {
        const resizeObserver = new ResizeObserver(entries => {
            const entry = entries[0]
            setTargetSize({
                width: entry.borderBoxSize[0].inlineSize,
                height: entry.borderBoxSize[0].blockSize
            })
        })
        resizeObserver.observe(targetRef.current)

        return () => { // cleanup
            resizeObserver.disconnect()
        }
    }, [])

    // respawn Target on window resize
    useEffect(() => {
        setPos({
            x: Math.random() * (playableAreaSize.width - targetSize.width),
            y: Math.random() * (playableAreaSize.height - targetSize.height)
        })
    }, [playableAreaSize, targetSize])
    

    function handleTargetClicked() {
        onTargetHit()

        // respawn target in new random (x,y) position
        setPos({
            x: Math.random() * (playableAreaSize.width - targetSize.width),
            y: Math.random() * (playableAreaSize.height - targetSize.height)
        })
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
    const { isGameOn } = useContext(GameStatusContext)

    useEffect(() => {
        if (!isGameOn) return // only start timer when "START" button is clicked

        const interval = setInterval(() => setTimeSeconds(prev => prev-1), 1000)

        return () => clearInterval(interval)
    }, [isGameOn])

    // watch for timer running out
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
    const [playableAreaSize, setPlayableAreaSize] = useState({width: 0, height: 0})
    const [isGameOn, setIsGameOn] = useState(false)
    const [isGameOver, setIsGameOver] = useState(false)

    const playableAreaRef = useRef(null)
    
    useEffect(() => {
        const resizeObserver = new ResizeObserver(entries => {
            const entry = entries[0]
            setPlayableAreaSize({
                width: entry.contentBoxSize[0].inlineSize,
                height: entry.contentBoxSize[0].blockSize
            })
        })
        resizeObserver.observe(playableAreaRef.current)

        return () => { // cleanup
            resizeObserver.disconnect()
        }
    }, [])

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

    function handleOnTargetHit() {
        setScore(prev=>prev+1) // increment score
    }

    return (
        <GameStatusContext value={{ isGameOn }}>
            <div id="playable-area" ref={playableAreaRef}>
                <div id="score-timer-container">
                    <span>Score: {score}</span>
                    <span><Timer onTimerEnd={ handleOnTimerEnd } /></span>
                </div>
                {isGameOn ?
                    <Target playableAreaSize={ playableAreaSize } onTargetHit={ handleOnTargetHit } />
                    :
                    <>
                        {isGameOver ? <GameOverScreen /> : <StartScreen />}
                    </>
                }
            </div>
        </GameStatusContext>
    )
}

export default HittheTarget