function Game({ gameName, game }) {
    return (
        <div className="game-container"
        style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            fontSize: "5vh"
        }}>
            <div style={{ textAlign: "center" }}>Playing... {gameName}</div>
            <div className="playable-area-container"
            style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center"
            }}>
                {game}
            </div>
        </div>
    )
}

export default Game