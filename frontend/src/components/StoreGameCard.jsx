import { useContext } from "react"
import { useNavigate } from "react-router-dom"

import { AuthContext } from "./contexts/AuthContext"
import { LibraryContext } from "./contexts/LibraryContext"
import './StoreGameCard.css'

import devLog from "../../utils/logging/logging"
import apiRequest from "../../utils/apiRequest"

const COMPONENT = "StoreGameCard"

function StoreGameCard( {gameID, gameName, description, author, gameVersion, highScore, isPlayable} ) {
    devLog(COMPONENT, "StoreGameCard() called")
    const { currentUser } = useContext(AuthContext)
    const { libraryList, setLibraryList, librarySet, setLibrarySet } = useContext(LibraryContext)
    const navigate = useNavigate()

    // add gameID to library using optimistic update
    async function handleAddToLibrary() {
        devLog(COMPONENT, "handleAddToLibrary() called")

        // send POST request to server to add game to user's library
        const token = localStorage.getItem("token") // get JWT token from localStorage
        const response_json = await apiRequest(COMPONENT, `library/${gameID}`, "POST", null, token)

        // Optimistic update: update user's library on UI if server returns success
        if (response_json.status == "Success") {
            devLog(COMPONENT, `Server added "${gameName}" with game ID ${gameID} to ${currentUser}'s library`)
            // get entry for new game in library
            // we use server response to get server timestamp of when game was successfully added to library
            const libraryEntry = response_json.data
            devLog(COMPONENT, `new Library entry recorded`)
            console.log(libraryEntry)

            // add the game to libraryList and librarySet
            setLibraryList([...libraryList, libraryEntry])
            setLibrarySet(new Set(librarySet).add(gameID))
        }
    }

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
                    <button disabled={ !currentUser || librarySet.has(gameID) } onClick={ handleAddToLibrary }> + Add to Library </button>
                    <button disabled={ !isPlayable } onClick={ handlePlayGame }> { isPlayable ? "Play" : "Placeholder cannot be played" } </button>
                </span>
            </div>
        </div>
    )
}

export default StoreGameCard