import './GamePage.css'

function GamePage({ gameName, game }) {
    return (
        <div className="game-container">
            <p>Playing... {gameName}</p>
            <div className="playable-area-container">
                {game}
            </div>
        </div>
    )
}

export default GamePage