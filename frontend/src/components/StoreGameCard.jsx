import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import './StoreGameCard.css'

// contexts
import { AuthContext } from "./contexts/AuthContext"
import { LibraryContext } from "./contexts/LibraryContext"

// utils
import devLog from "../../utils/logging/logging"

const COMPONENT = "StoreGameCard"

function StoreGameCard( {gameID, gameName, description, author, gameVersion, isPlayable, highScore} ) {
    devLog(COMPONENT, "StoreGameCard() called")
    const { currentUser } = useContext(AuthContext)
    const { librarySet, handleAddToLibrary } = useContext(LibraryContext)
    const navigate = useNavigate()

    // request game file download URL, download game files then redirect to game page
    async function handlePlayGame() {
        // send GET request to server requesting game download URL

        // send request to remote storage to download game files

        // redirect user to game page
        navigate(`/games/${gameName.replaceAll(" ","")}`)
    }

    return (
        <div id="store-gamecard">
            <img id="store-gamecard-cover" src={`/game-cover-images/${gameName}.jpg`} alt={ gameName } />
            <div id="store-gamecard-info">
                <h2 className="header-title">{ gameName }</h2>
                <p>{ description }</p>
                <hr />
                <p><b>AUTHOR: </b>{ author }</p>
                <p><b>VERSION: </b>{ gameVersion }</p>
                <p><b>HIGH SCORE: </b>{ highScore }</p>
                <hr />
                <span id="store-gamecard-buttons">
                    <button disabled={ !currentUser || librarySet.has(gameID) } onClick={ () => handleAddToLibrary(gameID) }> + Add to Library </button>
                    <button disabled={ !isPlayable } onClick={ handlePlayGame }> { isPlayable ? "Play" : "Placeholder cannot be played" } </button>
                </span>
            </div>
        </div>
    )
}

export default StoreGameCard