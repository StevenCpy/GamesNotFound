import { useContext } from "react"
import { AuthContext } from "./Context"
import SERVER_URL from "../data/server_variables"

function StoreGameCard( {gameID, gameName, author, gameVersion} ) {
    const { currentUser, librarySet } = useContext(AuthContext)

    // send POST request to add Id to library
    async function handleAddToLibrary() {
        // tell server to add game to library in user's library in database
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
                <img src={`/game-cover-images/${gameName}`} alt={ gameName } style={{ height:"10rem", width:"10rem" }} />
            </div>
            <div style={{
                height:"100%",
                width:"100%"
            }}>
                <div style={{ fontSize:"2.5rem", textAlign:"center" }}> <b>{ gameName }</b> </div>
                <div> <b>VERSION: </b> { gameVersion } </div>
                <div> <b>AUTHOR: </b> { author } </div>
                <button disabled={!currentUser || librarySet.has(gameID) } onClick={ handleAddToLibrary }> + Add to Library </button>
            </div>
        </div>
    )
}

export default StoreGameCard