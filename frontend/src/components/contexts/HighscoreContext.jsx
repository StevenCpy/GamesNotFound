import { createContext, useState } from "react"

import apiRequest from "../../../utils/apiRequest"

const COMPONENT = "HighscoreContext"

export const HighscoreContext = createContext(null)

export function HighscoreProvider( {children} ) {
    const [highscoreHashMap, setHighscoreHashMap] = useState(new Map()) // hash map for displaying high scores

    async function submitScore(gameID, score) {
        const body = {
            "gameID": gameID,
            "score": score
        }
        const token = localStorage.getItem("token")
        const response_json = await apiRequest(COMPONENT, "score/", "POST", body, token)
        
        if (response_json.status == "Success") {
            const highScore = response_json.data["high_score"]
            const lastPlayed = response_json.data["last_played"]
            const highscoreEntry = {"gameID": gameID, "high_score": highScore, "last_played": lastPlayed}

            // add high score entry to hash map if game has never been played before, otherwise update the entry with new high score if needed
            setHighscoreHashMap(prev => new Map(prev).set(gameID, highscoreEntry))
        }
    }

    return (
        <HighscoreContext value={{ highscoreHashMap, setHighscoreHashMap, submitScore }}>
            {children}
        </HighscoreContext>
    )
}