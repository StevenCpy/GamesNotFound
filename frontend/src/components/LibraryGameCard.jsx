import { useContext } from "react"

import { AuthContext } from "./contexts/AuthContext"
import { LibraryContext } from "./contexts/LibraryContext"

import devLog from "../../utils/logging/logging"
import apiRequest from "../../utils/apiRequest"

const COMPONENT = "LibraryGameCard"

function LibraryGameCard( {gameID, gameName, description, author, gameVersion} ) {
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
        <div style={{
            display:"flex",
            flexDirection:"row",
            height:"15rem",
            width:"40rem",
            gap:"1rem"
        }}>
            <div>
                <img src={`/game-cover-images/${gameName}.jpg`} alt={ gameName } style={{ height:"12rem", width:"12rem" }} />
            </div>
            <div style={{
                height:"100%",
                width:"100%"
            }}>
                <div style={{ fontSize:"2.5rem", textAlign:"center" }}> <b>{ gameName }</b> </div>
                <div> { description } </div>
                <hr />
                <div> <b>AUTHOR: </b> { author } </div>
                <div> <b>VERSION: </b> { gameVersion } </div>
                <hr />
                <span style={{
                    display:"flex",
                    flexDirection:"row",
                    gap:"1rem"
                }}>
                    <button onClick={ handleRemoveFromLibrary }> Remove from Library </button>
                    <button disabled> Play </button>
                </span>
            </div>
        </div>
    )
}

export default LibraryGameCard