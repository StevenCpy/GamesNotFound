import { useContext } from "react"
import { AuthContext } from "../components/Context"
import LibraryGameCard from "../components/LibraryGameCard"

function Library() {
    const { libraryList, storeList } = useContext(AuthContext)

    const storeHashMap = new Map(
        storeList.map(game => [game.gameID, game]) // creates key-value pair with key = gameID
    )

    return (
        <div style={{
            display:"flex",
            flexDirection: "column",
        }}>
            {libraryList.map(game =>
                <LibraryGameCard key={game.gameID}
                            gameID={game.gameID}
                            gameName={storeHashMap.get(game.gameID)["name"]}
                            author={storeHashMap.get(game.gameID)["author"]}
                            gameVersion={storeHashMap.get(game.gameID)["version"]} />
            )}
        </div>
    )
}

export default Library