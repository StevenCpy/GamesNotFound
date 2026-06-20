import { createContext, useState, use } from 'react'

// utils
import devLog from "../../utils/logging/logging"
import apiRequest from "../../utils/apiRequest"
import isoToLocaleDateString from "../../utils/isoToLocaleDateString"

const COMPONENT = "HighscoreContext"

type HighscoreContextType = {
    loadHighScores: () => Promise<void>
    clearHighScores: () => void
    getHighScore: (gameID: number) => number
    getLastPlayed: (gameID: number) => string
    submitScore: (gameID: number, score: number) => Promise<void>
}

export const HighscoreContext = createContext<HighscoreContextType|null>(null)

type ApiRequestFail = {
    status: "Fail"
    details: string
}

type Highscore = {
    gameID: number
    high_score: number
    last_played: string
}

type HighscoreResponseSuccess = {
    status: "Success"
    data: Highscore[]
}

type HighscoreResponse = ApiRequestFail | HighscoreResponseSuccess

export function HighscoreProvider( {children}: {children: React.ReactNode} ) {
    const [highscoreHashMap, setHighscoreHashMap] = useState<Map<number, Highscore>>(new Map()) // hash map for displaying high scores

    async function loadHighScores(): Promise<void> {
        devLog(COMPONENT, "loadHighScores() called")

        // send GET request to fetch high scores from server
        const token = localStorage.getItem("token") // get JWT token from localStorage
        const highscores_response_json: HighscoreResponse = await apiRequest(COMPONENT, "score/highscores", "GET", null, token)
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

    const clearHighScores: () => void = () => setHighscoreHashMap(new Map())

    function getHighScore(gameID: number) : number {
        const highScore = highscoreHashMap.get(gameID)?.["high_score"] ?? 0
        return highScore
    }

    function getLastPlayed(gameID: number) : string {
        const lastPlayed_iso = highscoreHashMap.get(gameID)?.["last_played"]
        const lastPlayed = lastPlayed_iso ? isoToLocaleDateString(lastPlayed_iso) : "N/A"
        return lastPlayed
    }

    async function submitScore(gameID: number, score: number) : Promise<void> {
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

export function useHighscore() {
    const highscoreContext = use(HighscoreContext)

    if (!highscoreContext) {
        throw new Error("HighscoreContext is null")
    }

    return highscoreContext
}