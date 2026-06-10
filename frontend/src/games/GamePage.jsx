import './GamePage.css'

function GamePage({ gameName, highScore, game }) {
    return (
        <div className="game-container">
            <p>Playing... {gameName} (High Score: {highScore})</p>
            <div className="playable-area-container">
                {game}
            </div>
        </div>
    )
}

export default GamePage