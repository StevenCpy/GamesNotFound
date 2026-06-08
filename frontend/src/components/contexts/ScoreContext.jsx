import { createContext, useState } from "react"

export const ScoreContext = createContext(null)

export function ScoreProvider( {children} ) {
    const [highscoreHashMap, setHighscoreHashMap] = useState(new Map()) // hash map for displaying high scores

    return (
        <ScoreContext value={{ highscoreHashMap, setHighscoreHashMap }}>
            {children}
        </ScoreContext>
    )
}