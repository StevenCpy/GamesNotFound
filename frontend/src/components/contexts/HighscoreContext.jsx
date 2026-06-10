import { createContext, useState } from "react"

export const HighscoreContext = createContext(null)

export function HighscoreProvider( {children} ) {
    const [highscoreHashMap, setHighscoreHashMap] = useState(new Map()) // hash map for displaying high scores

    return (
        <HighscoreContext value={{ highscoreHashMap, setHighscoreHashMap }}>
            {children}
        </HighscoreContext>
    )
}