import { useContext } from "react"
import { AuthContext } from "./Context"
import devLog from "../../utils/logging/logging"
import apiRequest from "../../utils/apiRequest"

const COMPONENT = "StoreGameCard"

function StoreGameCard( {gameID, gameName, author, gameVersion} ) {
    devLog(COMPONENT, "StoreGameCard() called")
    const { currentUser, libraryList, setLibraryList, librarySet, setLibrarySet } = useContext(AuthContext)

    // add gameID to library using optimistic update
    async function handleAddToLibrary() {
        devLog(COMPONENT, "handleAddToLibrary() called")

        // send addToLibrary POST request to server
        const response_json = await apiRequest(COMPONENT, `addToLibrary/${currentUser}/${gameID}`, "POST")

        // Optimistic update: update user's library on UI if server returns success
        if (response_json.status == "Success") {
            devLog(COMPONENT, `Server added "${gameName}" with game ID ${gameID} to ${currentUser}'s library`)
            // get entry for new game in library
            // we use server response to get server timestamp of when game was successfully added to library
            const libraryEntry = response_json.data[0]
            devLog(COMPONENT, `new Library entry recorded`)
            console.log(libraryEntry)

            // add the game to libraryList and librarySet
            setLibraryList([...libraryList, libraryEntry])
            setLibrarySet(new Set(librarySet).add(gameID))
        }
    }

    return (
        <div style={{
            display:"flex",
            flexDirection:"row",
            height:"12rem",
            width:"40rem",
            gap:"1rem"
        }}>
            <div>
                <img src={`/game-cover-images/${gameName}.jpg`} alt={ gameName } style={{ height:"10rem", width:"10rem" }} />
            </div>
            <div style={{
                height:"100%",
                width:"100%"
            }}>
                <div style={{ fontSize:"2.5rem", textAlign:"center" }}> <b>{ gameName }</b> </div>
                <div> <b>VERSION: </b> { gameVersion } </div>
                <div> <b>AUTHOR: </b> { author } </div>
                <button disabled={ !currentUser || librarySet.has(gameID) } onClick={ handleAddToLibrary }> + Add to Library </button>
            </div>
        </div>
    )
}

export default StoreGameCard