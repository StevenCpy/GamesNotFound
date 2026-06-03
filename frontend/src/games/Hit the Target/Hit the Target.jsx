import { useState, useEffect, useRef, createContext, useContext } from "react"
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

function Timer() {
    const [timeSeconds, setTimeSeconds] = useState(START_TIME_S)
    const { isGameOn, setIsGameOn, isGameOver, setIsGameOver } = useContext(GameStatusContext)

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeSeconds(prev => prev-1)
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    return (
        <>
            Timer: {timeSeconds}s
        </>
    )
}

function HittheTarget() {
    const [score, setScore] = useState(0)
    const [playableSize, setPlayableSize] = useState({width: 0, height: 0})
    const [refresh, setRefresh] = useState(0)
    const [isGameOn, setIsGameOn] = useState(false)
    const [isGameOver, setIsGameOver] = useState(false)

    const playableAreaRef = useRef(null)

    useEffect(() => {
        setPlayableSize({width: playableAreaRef.current.clientWidth, height: playableAreaRef.current.clientHeight})
    }, [refresh])

    return (
        <GameStatusContext value={{ isGameOn, setIsGameOn, isGameOver, setIsGameOver }}>
            <ScoreContext value={{ setScore }}>
                <div id="playable-area" ref={playableAreaRef}>
                    <div id="score-timer-container">
                        <span>Score: {score}</span>
                        <span><Timer onGameOver/></span>
                    </div>
                    {isGameOn ? 
                        <Target playableSize={playableSize} onTargetHit={() => setRefresh(refresh+1)} />
                        : <div id="start-button-container"><button id="start-button" onClick={() => setIsGameOn(true)}>START</button></div>
                    }
                </div>
            </ScoreContext>
        </GameStatusContext>
    )
}

export default HittheTarget