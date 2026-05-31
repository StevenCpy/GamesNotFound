import { useState, useEffect, useRef } from "react"

function PlayableArea() {
    const [playableWidth, setPlayableWidth] = useState(0)
    const [playableHeight, setPlayableHeight] = useState(0)
    const [refresh, setRefresh] = useState(0)

    const playableAreaRef = useRef(null)

    useEffect(() => {
        setPlayableWidth(playableAreaRef.current.clientWidth)
        setPlayableHeight(playableAreaRef.current.clientHeight)
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
                <Target playableWidth={playableWidth} playableHeight={playableHeight} onTargetHit={onTargetHit} />
            </div>
        </div>
    )
}

function Target({ playableWidth, playableHeight, onTargetHit }) {
    const [x, setX] = useState(Math.random() * playableWidth)
    const [y, setY] = useState(Math.random() * playableHeight)

    function getNewRandomPosition() {
        // generate new (x,y) for button
        setX(Math.random() * playableWidth)
        setY(Math.random() * playableHeight)
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
            left: x,
            top: y
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