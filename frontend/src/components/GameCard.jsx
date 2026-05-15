import { useContext } from "react"
import { AuthContext } from "./Context"

function GameCard( {gameName, gameVersion, author, coverImageName} ) {
    const { currentUser } = useContext(AuthContext)

    return (
        <div style={{
            display:"flex",
            flexDirection:"row",
            height:"12rem",
            width:"40rem",
            gap:"1rem"
        }}>
            <div>
                <img src={"/game-cover-images/" + coverImageName} alt={ gameName } style={{ height:"10rem", width:"10rem" }} />
            </div>
            <div style={{
                height:"100%",
                width:"100%"
            }}>
                <div style={{ fontSize:"2.5rem", textAlign:"center" }}> <b>{ gameName }</b> </div>
                <div> <b>VERSION: </b> { gameVersion } </div>
                <div> <b>AUTHOR: </b> { author } </div>
                <button disabled={!currentUser}> + Add to Library </button>
            </div>
        </div>
    )
}

export default GameCard