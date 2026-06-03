import './GameButton.css'

function GameButton({ onClick, text }) {
    return (
        <button class="game-button" onClick={onClick}>
            {text}
        </button>
    )
}

export default GameButton