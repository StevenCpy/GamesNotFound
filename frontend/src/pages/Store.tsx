import { useState, useEffect, useMemo } from 'react'
import './styling/Store.css'

// contexts
import { useStore } from "../components/contexts/StoreContext"
import { useHighscore } from "../components/contexts/HighscoreContext"

// components
import StoreGameCard from "../components/StoreGameCard"
import StoreMiniGameCard from '../components/StoreMiniGameCard'
import SortDropdown from "../components/controls/SortDropdown"
import SearchBar from "../components/controls/SearchBar"

// utils
import devLog from "../utils/logging/logging"
import { type StoreEntry } from '../components/ApiResponseTypes/StoreResponseTypes'

const COMPONENT = "Store"

function Store() {
    devLog(COMPONENT, "Store() called")
    const { storeList, sortStoreList } = useStore()
    const { getHighScore } = useHighscore()

    const [sortBy, setSortBy] = useState(localStorage.getItem("sortBy") ?? "Default")
    const [searchStr, setSearchStr] = useState("")
    const [currentGame, setCurrentGame] = useState<StoreEntry|null>(null)

    // to display sort options on UI
    const sortOptions = useMemo(() => [{value: "Default", label: "Default"},
                                        {value: "NameAsc", label: "Name (Ascending)"},
                                        {value: "NameDesc", label: "Name (Descending)"}], [])
    
    // to check which field to sort by
    type Values = {
        [key: string]: {field: "gameID"|"name", asc: boolean}
    }
    const values: Values = {Default: {field: "gameID", asc: true},
                            NameAsc: {field: "name", asc: true},
                            NameDesc: {field: "name", asc: false}}


    // re-render when new sorting option chosen
    useEffect(() => {
        const fieldToSortBy = values[sortBy].field
        const asc = values[sortBy].asc

        sortStoreList(fieldToSortBy, asc)
    }, [sortBy])

    const searchedStoreList = useMemo(() => {
        const regex = new RegExp(searchStr.toUpperCase()) // create new regex for searchStr, searchStr can be anywhere within game name
        return [...storeList].filter(game => regex.test(game.name.toUpperCase()))
    }, [searchStr, storeList])

    function CollapsibleGameInfo() {
        return (
            <div>
                {currentGame ?
                    <StoreGameCard key={currentGame.gameID}
                                    gameID={currentGame.gameID}
                                    gameName={currentGame.name}
                                    coverImageURL={currentGame.cover_image_url}
                                    description={currentGame.description}
                                    author={currentGame.author}
                                    gameVersion={currentGame.version}
                                    isPlayable={currentGame.is_playable}
                                    highScore={getHighScore(currentGame.gameID)} />
                    : <p>No game selected</p>
                }
            </div>
        )
    }

    return (
        <div id="store-container">
            <div id="store-sort-and-search-bar-container">
                <SearchBar setSearchStr={setSearchStr} />
                <SortDropdown sortBy={sortBy}
                                onChange={(e) => {
                                    setSortBy(e.target.value)
                                    localStorage.setItem("sortBy", e.target.value) // save "Sort By" preference
                                }}
                                options={sortOptions} />
            </div>
        
            <div id="store-collapsible">
                <CollapsibleGameInfo />
            </div>

            <div id="store-list-grid">
                {searchedStoreList.map(game => {
                    return (
                        <StoreMiniGameCard key={game.gameID}
                                            gameID={game.gameID}
                                            gameName={game.name}
                                            coverImageURL={game.cover_image_url} 
                                            isPlayable={game.is_playable}
                                            onClick={() => setCurrentGame(game)} />
                    )
                })}
            </div>
        </div>
    )
}

export default Store