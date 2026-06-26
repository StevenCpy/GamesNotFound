import { useNavigate } from 'react-router-dom'
// import './StoreGameCard.css'
import './StoreMiniGameCard.css'

// contexts
import { useAuth } from "./contexts/AuthContext"
import { useLibrary } from "./contexts/LibraryContext"

// utils
import devLog from "../utils/logging/logging"

const COMPONENT = "StoreMiniGameCard"

type StoreMiniGameCardProps = {
    gameID: number
    gameName: string
    coverImageURL: string
    isPlayable: boolean
    onClick: React.MouseEventHandler<HTMLDivElement>
}

function StoreMiniGameCard( {gameID, gameName, coverImageURL, isPlayable, onClick}: StoreMiniGameCardProps ) {
    devLog(COMPONENT, "StoreGameCard() called")
    const { currentUser } = useAuth()
    const { librarySet, handleAddToLibrary } = useLibrary()
    const navigate = useNavigate()

    // request game file download URL, download game files then redirect to game page
    async function handlePlayGame() : Promise<void> {
        // send GET request to server requesting game download URL

        // send request to remote storage to download game files

        // redirect user to game page
        navigate(`/games/${gameName.replaceAll(" ","")}`)
    }

    return (
        <div id="store-minigamecard" onClick={onClick}>
            <div id="store-minigamecard-info">
                <img id="store-minigamecard-cover" src={ coverImageURL } alt={ gameName } />
                <h2 className="header-title">{ gameName }</h2>
            </div>

            <div id="store-minigamecard-buttons">
                <button disabled={ !currentUser || librarySet.has(gameID) } onClick={ () => handleAddToLibrary(gameID) }> + Add to Libary</button>
                {isPlayable && <button onClick={ handlePlayGame }>Play</button>}
            </div>
        </div>
    )
}

export default StoreMiniGameCard