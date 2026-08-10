import { useState, useEffect } from 'react'
import './Leaderboard.css'

// contexts
import { useStore } from './contexts/StoreContext'

// utils
import devLog from "../utils/logging/logging"

import { type LeaderboardResponseEntry } from './ApiResponseTypes/StoreResponseTypes'

const COMPONENT = "Leaderboard"

function Leaderboard( {gameID}: {gameID: number} ) {
    devLog(COMPONENT, "Leaderboard() called")
    const [leaderboard, setLeaderboard] = useState<LeaderboardResponseEntry[]>([])

    const { getLeaderboard } = useStore()

    async function fetchLeaderboard() {
        const response = await getLeaderboard(gameID)

        if (response.status == "Success") {
            setLeaderboard(response.data)
        }
    }

    useEffect(() => {
        fetchLeaderboard()
    }, [])

    return (
        <table id="game-leaderboard">
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Username</th>
                    <th>Score</th>
                </tr>
            </thead>
            <tbody>
                {leaderboard.map((entry, index) => {
                    return (
                        <tr className="game-leaderboard-entry" key={entry.username}>
                            <td>#{index+1}</td>
                            <td>{entry.username}</td>
                            <td>{entry.high_score}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

export default Leaderboard