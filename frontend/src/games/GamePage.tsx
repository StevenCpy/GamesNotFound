import './GamePage.css'

type GamePageProps = {
    gameName: string
    highScore: number
    game: React.ReactNode
}

function GamePage( {gameName, highScore, game}: GamePageProps) {
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