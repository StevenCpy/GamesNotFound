import { useContext } from 'react'
import GameCard from '../components/GameCard'
import games from '../data/games'
import { AuthContext } from '../components/Context'

function Store() {
    const { storeList } = useContext(AuthContext)

    return (
        <div style={{
            display:"flex",
            flexDirection: "column",
        }}>
            {storeList.map(game =>
                <GameCard key={game.gameID}
                            gameID={game.gameID}
                            gameName={game.gameName}
                            gameVersion={`${game.gameMajor}.${game.gameMinor}.${game.gamePatch}`}
                            author={game.author} />
            )}
        </div>
    )
}

export default Store