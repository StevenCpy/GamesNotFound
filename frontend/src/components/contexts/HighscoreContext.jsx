import { createContext, useState } from "react"

import devLog from "../../../utils/logging/logging"
import apiRequest from "../../../utils/apiRequest"
import isoToLocaleDateString from "../../../utils/isoToLocaleDateString"

const COMPONENT = "HighscoreContext"

export const HighscoreContext = createContext(null)

export function HighscoreProvider( {children} ) {
    const [highscoreHashMap, setHighscoreHashMap] = useState(new Map()) // hash map for displaying high scores

    async function loadHighScores() {
        devLog(COMPONENT, "loadHighScores() called")

        // send GET request to fetch high scores from server
        const token = localStorage.getItem("token") // get JWT token from localStorage
        const highscores_response_json = await apiRequest(COMPONENT, "score/highscores", "GET", null, token)
        if (highscores_response_json.status == "Success") {
            devLog(COMPONENT, "High scores fetched")
            // initialize high score hash map
            const highscoreList = highscores_response_json.data
            const highscoreHashMap = new Map(
                highscoreList.map(game => [game.gameID, game])
            )
            setHighscoreHashMap(highscoreHashMap)
        }
    }

    const clearHighScores = () => setHighscoreHashMap(new Map())

    function getHighScore(gameID) {
        const highScore = highscoreHashMap.has(gameID) ? highscoreHashMap.get(gameID)["high_score"] : 0
        return highScore
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
        <HighscoreContext value={{ loadHighScores, clearHighScores, getHighScore, getLastPlayed, submitScore }}>
            {children}
        </HighscoreContext>
    )
}