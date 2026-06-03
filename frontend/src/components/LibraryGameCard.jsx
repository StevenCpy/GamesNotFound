import { useContext } from "react"

import { AuthContext } from "./contexts/AuthContext"
import { LibraryContext } from "./contexts/LibraryContext"
import './LibraryGameCard.css'

import devLog from "../../utils/logging/logging"
import apiRequest from "../../utils/apiRequest"

const COMPONENT = "LibraryGameCard"

function LibraryGameCard( {gameID, gameName, description, author, gameVersion, isPlayable} ) {
    devLog(COMPONENT, "LibraryGameCard() called")
    const { currentUser } = useContext(AuthContext)
    const { libraryList, setLibraryList, librarySet, setLibrarySet } = useContext(LibraryContext)

    // remove gameID from library using optimistic update
    async function handleRemoveFromLibrary() {
        devLog(COMPONENT, "handleRemoveFromLibrary() called")

        // send removeFromLibrary DELETE request to server
        const response_json = await apiRequest(COMPONENT, `removeFromLibrary/${currentUser}/${gameID}`, "DELETE")

        if (response_json.status == "Success") {
            devLog(COMPONENT, `Server removed "${gameName}" with game ID ${gameID} from ${currentUser}'s library`)

            // remove the game from libraryList and librarySet
            setLibraryList(libraryList.filter(game =>
                game.gameID != gameID)
            )
            setLibrarySet(librarySet => {
                const newLibrarySet = new Set(librarySet)
                newLibrarySet.delete(gameID)
                return newLibrarySet
            })
        }
    }

    return (
        <div id="library-gamecard">
            <img id="library-gamecard-cover" src={`/game-cover-images/${gameName}.jpg`} alt={ gameName } />
            <div id="library-gamecard-info">
                <p><b>{ gameName }</b></p>
                <p>{ description }</p>
                <hr />
                <p><b>AUTHOR: </b> { author }</p>
                <p><b>VERSION: </b> { gameVersion }</p>
                <hr />
                <span id="library-gamecard-buttons">
                    <button onClick={ handleRemoveFromLibrary }> Remove from Library </button>
                    <button disabled> { isPlayable ? "Play on Store" : "Placeholder cannot be played" } </button>
                </span>
            </div>
        </div>
    )
}

export default LibraryGameCard