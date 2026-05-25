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
                            gameName={game.name}
                            author={game.author}
                            gameVersion={game.version} />
            )}
        </div>
    )
}

export default Store