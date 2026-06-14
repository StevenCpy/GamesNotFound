import { useContext, useState } from 'react'
import './styling/Store.css'

// contexts
import { StoreContext } from "../components/contexts/StoreContext"
import { HighscoreContext } from "../components/contexts/HighscoreContext"

// components
import StoreGameCard from "../components/StoreGameCard"
import SortDropdown from "../components/controls/searchBar"

// utils
import devLog from "../../utils/logging/logging"

const COMPONENT = "Store"

function Store() {
    devLog(COMPONENT, "Store() called")
    const { storeList } = useContext(StoreContext)
    const { getHighScore } = useContext(HighscoreContext)

    const [sortBy, setSortBy] = useState(localStorage.getItem("sortBy") ?? "default")

    const sortOptions = useMemo(() => [{value: "default", label: "Default"},
                                        {value: "NameAsc", label: "Name (Ascending)"},
                                        {value: "NameDesc", label: "Name (Descending)"}])

    return (
        <div id="store-container">
            <div id="store-search-bar">
                <SortDropdown sortBy={sortBy}
                                onChange={(e) => {
                                    setSortBy(e.target.value)
                                    localStorage.setItem("sortBy", e.target.value) // save "Sort By" preference
                                }}
                                options={sortOptions} />
            </div>
        
            <div id="store-list">
                {storeList.map(game => {
                    const highScore = getHighScore(game.gameID)
                    
                    return (
                        <StoreGameCard key={game.gameID}
                                        gameID={game.gameID}
                                        gameName={game.name}
                                        coverImageURL={game.cover_image_url}
                                        description={game.description}
                                        author={game.author}
                                        gameVersion={game.version}
                                        isPlayable={game.is_playable}
                                        highScore={highScore} />
                    )
                })}
            </div>
        </div>
    )
}

export default Store