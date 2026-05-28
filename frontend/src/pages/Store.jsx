import { useContext } from 'react'
import { AuthContext } from '../components/Context'
import StoreGameCard from '../components/StoreGameCard'
import devLog from "../../test/logging"

const COMPONENT = "Store"

function Store() {
    devLog(COMPONENT, "Store() called")
    const { storeList } = useContext(AuthContext)

    return (
        <div style={{
            display:"flex",
            flexDirection: "column",
        }}>
            {storeList.map(game =>
                <StoreGameCard key={game.gameID}
                                gameID={game.gameID}
                                gameName={game.name}
                                author={game.author}
                                gameVersion={game.version} />
            )}
        </div>
    )
}

export default Store