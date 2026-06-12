import { createContext, useState } from "react"

import apiRequest from "../../../utils/apiRequest"

const COMPONENT = "HighscoreContext"

export const HighscoreContext = createContext(null)

export function HighscoreProvider( {children} ) {
    const [highscoreHashMap, setHighscoreHashMap] = useState(new Map()) // hash map for displaying high scores

    function getHighScore(gameID) {
        const highScore = highscoreHashMap.has(gameID) ? highscoreHashMap.get(gameID)["high_score"] : 0
        return highScore
    }

    function isoToLocaleDateString(isoDate) {
        const date = new Date(isoDate)
        const options = {
            year: "numeric",
            month: "long",
            day: "numeric"
        }
        return date.toLocaleDateString("en-CA", options)
    }

    function getLastPlayed(gameID) {
        if (highscoreHashMap.has(gameID)) {
            const lastPlayed_iso = highscoreHashMap.get(gameID)["last_played"]
            const lastPlayed = isoToLocaleDateString(lastPlayed_iso)
            return lastPlayed
        } else {
            return "N/A"
        }
    }

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
        <HighscoreContext value={{ setHighscoreHashMap, getHighScore, getLastPlayed, submitScore }}>
            {children}
        </HighscoreContext>
    )
}