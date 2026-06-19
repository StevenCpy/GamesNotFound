import './styling/Library.css'

// contexts
import { useStore } from "../components/contexts/StoreContext"
import { useLibrary } from "../components/contexts/LibraryContext"
import { useHighscore } from "../components/contexts/HighscoreContext"

// components
import LibraryGameCard from "../components/LibraryGameCard"

// utils
import devLog from "../utils/logging/logging"

const COMPONENT = "Library"

function Library() {
    devLog(COMPONENT, "Library() called")
    const { storeList } = useStore()
    const { libraryList } = useLibrary()
    const { getHighScore, getLastPlayed } = useHighscore()

    const storeHashMap = new Map(
        storeList.map(game => [game.gameID, game]) // creates key-value pair with key = gameID
    )

    function emptyLibrary() {
        return (
            <div id="empty-library">
                <h2 className="header-title">
                    Your library is empty!<br />
                    Add more games from the store by clicking on "+ Add to Library"
                </h2>
            </div>
        )
    }

    return (
        libraryList.length ?
            (<div id="library-list">
                {libraryList.map(game => {
                    const gameID = game.gameID
                    const highScore = getHighScore(gameID)
                    const lastPlayed = getLastPlayed(gameID)

                    return (
                        <LibraryGameCard key={gameID}
                                        gameID={gameID}
                                        gameName={storeHashMap.get(gameID)!["name"]}
                                        coverImageURL={storeHashMap.get(gameID)!["cover_image_url"]}
                                        description={storeHashMap.get(gameID)!["description"]}
                                        author={storeHashMap.get(gameID)!["author"]}
                                        gameVersion={storeHashMap.get(gameID)!["version"]}
                                        isPlayable={storeHashMap.get(gameID)!["is_playable"]}
                                        highScore={highScore}
                                        lastPlayed={lastPlayed} />
                    )
                })}
            </div>)
        : emptyLibrary()
    )
}

export default Library