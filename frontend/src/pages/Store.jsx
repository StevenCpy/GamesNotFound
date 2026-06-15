import { useContext, useState, useEffect } from 'react'
import './styling/Store.css'

// contexts
import { StoreContext } from "../components/contexts/StoreContext"
import { HighscoreContext } from "../components/contexts/HighscoreContext"

// components
import StoreGameCard from "../components/StoreGameCard"
import SortDropdown from "../components/controls/SortDropdown"
import SearchBar from "../components/controls/SearchBar"

// utils
import devLog from "../../utils/logging/logging"

const COMPONENT = "Store"

function Store() {
    devLog(COMPONENT, "Store() called")
    const { storeList, sortStoreList } = useContext(StoreContext)
    const { getHighScore } = useContext(HighscoreContext)

    const [sortBy, setSortBy] = useState(localStorage.getItem("sortBy") ?? "Default")
    const [searchStr, setSearchStr] = useState("")

    // to display sort options on UI
    const sortOptions = useMemo(() => [{value: "Default", label: "Default"},
                                        {value: "NameAsc", label: "Name (Ascending)"},
                                        {value: "NameDesc", label: "Name (Descending)"}])
    
    // to check which field to sort by
    const values = {Default: {field: "gameID", asc: true},
                    NameAsc: {field: "name", asc: true},
                    NameDesc: {field: "name", asc: false}}


    // re-render when new sorting option chosen
    useEffect(() => {
        const fieldToSortBy = values[sortBy].field
        const asc = values[sortBy].asc

        sortStoreList(fieldToSortBy, asc)
    }, [sortBy])

    const searchedStoreList = useMemo(() => {
        const regex = new RegExp(searchStr.toUpperCase()) // game name should start with searchStr
        return [...storeList].filter(game => regex.test(game.name.toUpperCase()))
    }, [searchStr, storeList])

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
        
            <div id="store-list">
                {searchedStoreList.map(game => {
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