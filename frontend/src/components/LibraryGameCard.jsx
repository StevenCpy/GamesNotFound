import { useContext } from "react"

import { LibraryContext } from "./contexts/LibraryContext"
import './LibraryGameCard.css'

import devLog from "../../utils/logging/logging"

const COMPONENT = "LibraryGameCard"

function LibraryGameCard( {gameID, gameName, description, author, gameVersion, isPlayable, highScore, lastPlayed} ) {
    devLog(COMPONENT, "LibraryGameCard() called")
    const { handleRemoveFromLibrary } = useContext(LibraryContext)

    return (
        <div id="library-gamecard">
            <img id="library-gamecard-cover" src={`/game-cover-images/${gameName}.jpg`} alt={ gameName } />
            <div id="library-gamecard-info">
                <h2 className="header-title">{ gameName }</h2>
                <p>{ description }</p>
                <hr />

                <div id="library-gamecard-info-metadata">
                    <div id="library-gamecard-info-metadata-left">
                        <p><b>AUTHOR: </b>{ author }</p>
                        <p><b>VERSION: </b>{ gameVersion }</p>
                    </div>
                    <div id="library-gamecard-info-metadata-right">
                        <p><b>HIGH SCORE: </b>{ highScore }</p>
                        <p><b>LAST PLAYED: </b>{ lastPlayed }</p>
                    </div>
                </div>
 
                <hr />
                <span id="library-gamecard-buttons">
                    <button onClick={ () => handleRemoveFromLibrary(gameID) }> Remove from Library </button>
                    <button disabled> { isPlayable ? "Play on Store" : "Placeholder cannot be played" } </button>
                </span>
            </div>
        </div>
    )
}

export default LibraryGameCard