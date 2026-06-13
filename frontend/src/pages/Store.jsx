import { useContext } from 'react'
import './styling/Store.css'

// contexts
import { StoreContext } from '../components/contexts/StoreContext'
import { HighscoreContext } from '../components/contexts/HighscoreContext'

// components
import StoreGameCard from '../components/StoreGameCard'

// utils
import devLog from "../../utils/logging/logging"

const COMPONENT = "Store"

function Store() {
    devLog(COMPONENT, "Store() called")
    const { storeList } = useContext(StoreContext)
    const { getHighScore } = useContext(HighscoreContext)

    return (
        <div id="store-list">
            {storeList.map(game => {
                const highScore = getHighScore(game.gameID)
                
                return (
                    <StoreGameCard key={game.gameID}
                                    gameID={game.gameID}
                                    gameName={game.name}
                                    coverImageURL={game.cover_image_url}
                                    description={game.description}
                                    author={game.author}
                                    gameVersion={game.version}
                                    isPlayable={game.is_playable}
                                    highScore={highScore} />
                )
            })}
        </div>
    )
}

export default Store