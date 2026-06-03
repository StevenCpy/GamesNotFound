import { useContext } from "react"

import { StoreContext } from "../components/contexts/StoreContext"
import { LibraryContext } from "../components/contexts/LibraryContext"
import LibraryGameCard from "../components/LibraryGameCard"
import './styling/Library.css'

import devLog from "../../utils/logging/logging"

const COMPONENT = "Library"

function Library() {
    devLog(COMPONENT, "Library() called")
    const { storeList } = useContext(StoreContext)
    const { libraryList } = useContext(LibraryContext)

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
                            description={storeHashMap.get(game.gameID)["description"]}
                            author={storeHashMap.get(game.gameID)["author"]}
                            gameVersion={storeHashMap.get(game.gameID)["version"]}
                            isPlayable={storeHashMap.get(game.gameID)["is_playable"]} />
            )}
        </div>
    )
}

export default Library