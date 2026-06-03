import './GameButton.css'

function GameButton({ onClick, text }) {
    return (
        <button className="game-button" onClick={onClick}>
            {text}
        </button>
    )
}

export default GameButton