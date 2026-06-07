import { createContext, useState } from "react"

export const ScoreContext = createContext(null)

export function ScoreProvider( {children} ) {
    const [highscoreList, setHighscoreList] = useState([]) // list for displaying high scores

    return (
        <ScoreContext value={{ highscoreList, setHighscoreList }}>
            {children}
        </ScoreContext>
    )
}