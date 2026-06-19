import './GameButton.css'

type GameButtonProps = {
    onClick: () => void
    text: string
}

function GameButton( {onClick, text}: GameButtonProps ) {
    return (
        <button className="game-button" onClick={onClick}>
            {text}
        </button>
    )
}

export default GameButton