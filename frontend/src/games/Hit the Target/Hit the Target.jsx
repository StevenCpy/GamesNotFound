import { useState } from "react"

function HitTheTarget() {
    const [score, setScore] = useState(0)

    function Target() {
        return (
            <button style={{
                lineHeight: 1,
                border: "none",
                background: "transparent",
                fontSize: "10vh"
            }}>
                🎯
            </button>
        )
    }

    return (
        <div class="game-container"
        style={{
            height: "90vh",
            fontSize: "5vh"
        }}>
            <div style={{ textAlign: "center" }}>Hit the Target</div>
            <div class="playable-area"
            style={{
                backgroundColor: "white",
                height: "100%"
            }}>
               <Target /> 
            </div>
        </div>
    )
}

export default HitTheTarget