import { useState, useEffect, useRef, createContext, useContext } from "react"

const ScoreContext = createContext(null)

function PlayableArea() {
    const [playableSize, setPlayableSize] = useState({width: 0, height: 0})
    const [refresh, setRefresh] = useState(0)

    const playableAreaRef = useRef(null)

    useEffect(() => {
        setPlayableSize({width: playableAreaRef.current.clientWidth, height: playableAreaRef.current.clientHeight})
    }, [refresh])

    return (
        <div className="playable-area-container"
        style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <div className="playable-area"
            ref={playableAreaRef}
            style={{
                width: "90%",
                height: "90%",
                position: "relative",
                backgroundColor: "lightblue"
            }}>
                <Target playableSize={playableSize} onTargetHit={() => setRefresh(refresh+1)} />
            </div>
        </div>
    )
}

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
        <button onClick={ handleTargetClicked }
        ref={targetRef}
        style={{
            position: "absolute",
            lineHeight: 1,
            border: "none",
            background: "transparent",
            fontSize: "10vh",
            left: pos.x,
            top: pos.y
        }}>
            🎯
        </button>
    )
}

function HitTheTarget() {
    const [score, setScore] = useState(0)

    return (
        <div className="game-container"
        style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            fontSize: "5vh"
        }}>
            <div style={{ textAlign: "center" }}>Playing... Hit the Target (Score: {score})</div>
            <ScoreContext value={{ setScore }}>
                <PlayableArea />
            </ScoreContext>
        </div>
    )
}

export default HitTheTarget