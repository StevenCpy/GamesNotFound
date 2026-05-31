import { useState, useEffect, useRef, createContext, useContext } from "react"
import "./Hit the Target.css"

const ScoreContext = createContext(null)

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

function HitTheTarget() {
    const [score, setScore] = useState(0)
    const [playableSize, setPlayableSize] = useState({width: 0, height: 0})
    const [refresh, setRefresh] = useState(0)

    const playableAreaRef = useRef(null)

    useEffect(() => {
        setPlayableSize({width: playableAreaRef.current.clientWidth, height: playableAreaRef.current.clientHeight})
    }, [refresh])

    return (
        <ScoreContext value={{ setScore }}>
            <div id="playable-area" ref={playableAreaRef}>
                <Target playableSize={playableSize} onTargetHit={() => setRefresh(refresh+1)} />
            </div>
        </ScoreContext>
    )
}

export default HitTheTarget