import { useContext } from 'react'
import { StoreContext } from '../components/contexts/StoreContext'
import StoreGameCard from '../components/StoreGameCard'
import devLog from "../../utils/logging/logging"

const COMPONENT = "Store"

function Store() {
    devLog(COMPONENT, "Store() called")
    const { storeList } = useContext(StoreContext)

    return (
        <div style={{
            display:"flex",
            flexDirection: "column",
        }}>
            {storeList.map(game =>
                <StoreGameCard key={game.gameID}
                                gameID={game.gameID}
                                gameName={game.name}
                                description={game.description}
                                author={game.author}
                                gameVersion={game.version} />
            )}
        </div>
    )
}

export default Store