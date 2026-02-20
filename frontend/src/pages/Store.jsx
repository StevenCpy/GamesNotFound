import StoreGame from '../components/storeGame'
import games from '../data/games'

function Store() {
    return (
        <div style={{
            display:"flex",
            flexDirection: "column",
        }}>
            {games.games.map(game =>
                <StoreGame key={game.Id} gameName={game.gameName} gameVersion={game.gameVersion} author={game.author} coverImageName={game.coverImageName} />
            )}
        </div>
    )
}

export default Store