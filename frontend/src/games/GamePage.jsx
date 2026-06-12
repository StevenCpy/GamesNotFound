import './GamePage.css'

function GamePage({ gameName, highScore, game }) {
    return (
        <div className="game-container">
            <h6 className="header-title">Playing... {gameName} (High Score: {highScore})</h6>
            <div className="playable-area-container">
                {game}
            </div>
        </div>
    )
}

export default GamePage