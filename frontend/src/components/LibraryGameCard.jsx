import { useContext } from "react"
import { AuthContext } from "./Context"
import SERVER_URL from "../data/server_variables"

function LibraryGameCard( {gameID, gameName, author, gameVersion} ) {
    const { currentUser, libraryList, setLibraryList, librarySet, setLibrarySet } = useContext(AuthContext)

    // send removeFromLibrary POST request to server
    async function handleRemoveFromLibraryServer() {
        try {
            const response = await fetch(`${SERVER_URL}/removeFromLibrary/${currentUser}/${gameID}`, {
                method: "DELETE"
            })
        const response_json = await response.json()
        return response_json
      } catch (error) {
        console.error("Error calling removeFromLibrary API", error)
        return {"status": "Fail", "details": "Error calling removeFromLibrary API"}
      }
    }

    // remove gameID from library using optimistic update
    async function handleRemoveFromLibrary() {
        // tell server to remove game from user's library in database
        const response_json = await handleRemoveFromLibraryServer()

        if (response_json.status == "Success") {
            console.log(`Server successfully removed "${gameName}" with game ID ${gameID} from ${currentUser}'s library`)

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
                <button onClick={ handleRemoveFromLibrary }> Remove from Library </button>
            </div>
        </div>
    )
}

export default LibraryGameCard