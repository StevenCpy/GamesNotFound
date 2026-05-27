import { useContext } from "react"
import { AuthContext } from "./Context"
import SERVER_URL from "../data/server_variables"

function StoreGameCard( {gameID, gameName, author, gameVersion} ) {
    const { currentUser, libraryList, setLibraryList, librarySet, setLibrarySet } = useContext(AuthContext)

    // send addToLibrary POST request to server
    async function handleAddToLibraryServer() {
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
        // tell server to add game to library in user's library in database
        const response_json = handleAddToLibraryServer()

        // Optimistic update: update user's library on UI if server returns success
        if (response_json.status == "Success") {
            console.log(`Server successfully added "${gameName}" with game ID ${gameID} to ${currentUser}'s library`)
            // get entry for new game in library
            // we use server response to get server timestamp of when game was successfully added to library
            const libraryEntry = response_json.data[0]
            // add the game to libraryList and librarySet
            setLibraryList([...libraryList, libraryEntry])
            setLibrarySet(new Set(librarySet).add(libraryEntry))
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