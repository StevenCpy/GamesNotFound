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

        // // send DELETE request to server to remove game from user's library
        const token = localStorage.getItem("token") // get JWT token from localStorage
        const response_json = await apiRequest(COMPONENT, `library/${gameID}`, "DELETE", null, token)

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
                <h2 className="header-title">{ gameName }</h2>
                <p>{ description }</p>
                <hr />
                <p><b>AUTHOR: </b>{ author }</p>
                <p><b>VERSION: </b>{ gameVersion }</p>
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