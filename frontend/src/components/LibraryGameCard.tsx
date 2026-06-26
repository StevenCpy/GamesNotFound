import './LibraryGameCard.css'

// contexts
import { useLibrary } from "./contexts/LibraryContext"

// utils
import devLog from "../utils/logging/logging"

const COMPONENT = "LibraryGameCard"

type LibraryGameCardProps = {
    gameID: number
    gameName: string
    coverImageURL: string
    description: string
    author: string
    gameVersion: string
    isPlayable: boolean
    highScore: number
    lastPlayed: string
}

function LibraryGameCard( {gameID, gameName, coverImageURL, description, author, gameVersion, isPlayable, highScore, lastPlayed}: LibraryGameCardProps ) {
    devLog(COMPONENT, "LibraryGameCard() called")
    const { handleRemoveFromLibrary } = useLibrary()

    return (
        <div id="library-gamecard">
            <img id="library-gamecard-cover" src={ coverImageURL } alt={ gameName } />
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
                <div id="library-gamecard-buttons">
                    <button onClick={ () => handleRemoveFromLibrary(gameID) }> Remove from Library </button>
                    <button disabled> { isPlayable ? "Play on Store" : "Placeholder cannot be played" } </button>
                </div>
            </div>
        </div>
    )
}

export default LibraryGameCard