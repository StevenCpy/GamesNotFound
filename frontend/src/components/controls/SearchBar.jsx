import { useState } from 'react'
import './SearchBar.css'

function SearchBar( {setSearchStr} ) {
    const [value, setValue] = useState("")

    return (
        <form onSubmit={(e) => {e.preventDefault(); setSearchStr(value)}} className="search-bar">
            <input 
                type="text"
                placeholder="Search a game..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
        </form>
    )
}

export default SearchBar