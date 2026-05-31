import { useState, useEffect, useRef } from "react"

function PlayableArea() {
    const [playableSize, setPlayableSize] = useState({width: 0, height: 0})
    const [refresh, setRefresh] = useState(0)

    const playableAreaRef = useRef(null)

    useEffect(() => {
        setPlayableSize({width: playableAreaRef.current.clientWidth, height: playableAreaRef.current.clientHeight})
    }, [refresh])

    // refresh playableArea
    function onTargetHit() {
        setRefresh(refresh+1)
    }

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
                <Target playableSize={playableSize} onTargetHit={(onTargetHit)} />
            </div>
        </div>
    )
}

function Target({ playableSize, onTargetHit }) {
    const [pos, setPos] = useState({x: Math.random() * playableSize.width, y: Math.random() * playableSize.height})

    function getNewRandomPosition() {
        // generate new (x,y) for button
        setPos({x: Math.random() * playableSize.width, y: Math.random() * playableSize.height})
        onTargetHit() // refresh playableArea to get new window dimension in case it was resized
    }

    return (
        <button onClick={ getNewRandomPosition }
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
            <div style={{ textAlign: "center" }}>Playing... Hit the Target</div>
            <PlayableArea />
        </div>
    )
}

export default HitTheTarget