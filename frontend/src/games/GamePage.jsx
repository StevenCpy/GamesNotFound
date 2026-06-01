import './GamePage.css'

function GamePage({ gameName, game }) {
    return (
        <div className="game-container">
            <div style={{ textAlign: "center" }}>Playing... {gameName}</div>
            <div className="playable-area-container">
                {game}
            </div>
        </div>
    )
}

export default GamePage