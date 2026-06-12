import { useContext } from "react"

import { StoreContext } from "../components/contexts/StoreContext"
import { LibraryContext } from "../components/contexts/LibraryContext"
import { HighscoreContext } from "../components/contexts/HighscoreContext"
import LibraryGameCard from "../components/LibraryGameCard"
import './styling/Library.css'

import devLog from "../../utils/logging/logging"

const COMPONENT = "Library"

function Library() {
    devLog(COMPONENT, "Library() called")
    const { storeList } = useContext(StoreContext)
    const { libraryList } = useContext(LibraryContext)
    const { getHighScore, getLastPlayed } = useContext(HighscoreContext)

    const storeHashMap = new Map(
        storeList.map(game => [game.gameID, game]) // creates key-value pair with key = gameID
    )

    return (
        <div id="library-list">
            {libraryList.map(game => {
                const gameID = game.gameID
                const highScore = getHighScore(gameID)
                const lastPlayed = getLastPlayed(gameID)

                return (
                    <LibraryGameCard key={gameID}
                                    gameID={gameID}
                                    gameName={storeHashMap.get(gameID)["name"]}
                                    description={storeHashMap.get(gameID)["description"]}
                                    author={storeHashMap.get(gameID)["author"]}
                                    gameVersion={storeHashMap.get(gameID)["version"]}
                                    isPlayable={storeHashMap.get(gameID)["is_playable"]}
                                    highScore={highScore}
                                    lastPlayed={lastPlayed} />
                )
            })}
        </div>
    )
}

export default Library