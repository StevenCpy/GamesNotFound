import { useContext } from "react"
import { AuthContext } from "./Context"
import SERVER_URL from "../data/server_variables"
import devLog from "../../test/logging"

const COMPONENT = "StoreGameCard"

function StoreGameCard( {gameID, gameName, author, gameVersion} ) {
    devLog(COMPONENT, "StoreGameCard() called")
    const { currentUser, libraryList, setLibraryList, librarySet, setLibrarySet } = useContext(AuthContext)

    // send addToLibrary POST request to server
    async function handleAddToLibraryServer() {
        devLog(COMPONENT, "handleAddToLibraryServer() called")
        
        try {
            const response = await fetch(`${SERVER_URL}/addToLibrary/${currentUser}/${gameID}`, {
                method: "POST"
            })
            const response_json = await response.json()
            return response_json
        } catch (error) {
            console.error("Error calling addToLibrary API", error)
            return {"status": "Fail", "details": "Error calling addToLibrary API"}
        }
    }

    // add gameID to library using optimistic update
    async function handleAddToLibrary() {
        devLog(COMPONENT, "handleAddToLibrary() called")

        // tell server to add game to library in user's library in database
        const response_json = await handleAddToLibraryServer()

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