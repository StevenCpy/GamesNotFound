import { useContext } from "react"
import { AuthContext } from "./Context"

function LibraryGameCard( {gameID, gameName, author, gameVersion} ) {
    const { currentUser } = useContext(AuthContext)

    // send POST request to add Id to library
    async function handleRemoveFromLibrary() {
        // tell server to remove game from user's library in database
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
                <button onClick={ handleRemoveFromLibrary }> Remove from Library </button>
            </div>
        </div>
    )
}

export default LibraryGameCard