import { useContext } from 'react'

import { StoreContext } from '../components/contexts/StoreContext'
import { ScoreContext } from '../components/contexts/ScoreContext'
import StoreGameCard from '../components/StoreGameCard'
import './styling/Store.css'

import devLog from "../../utils/logging/logging"

const COMPONENT = "Store"

function Store() {
    devLog(COMPONENT, "Store() called")
    const { storeList } = useContext(StoreContext)
    const { highscoreHashMap } = useContext(ScoreContext)

    return (
        <div id="store-list">
            {storeList.map(game => {
                const highScore = highscoreHashMap.has(game.gameID) ? highscoreHashMap.get(game.gameID)["high_score"] : 0
                
                return (
                    <StoreGameCard key={game.gameID}
                                    gameID={game.gameID}
                                    gameName={game.name}
                                    description={game.description}
                                    author={game.author}
                                    gameVersion={game.version}
                                    highScore={highScore}
                                    isPlayable={game.is_playable} />
                )
            })}
        </div>
    )
}

export default Store