import { useState } from 'react'
import './SearchBar.css'

type SearchBarProps = {
    setSearchStr: React.Dispatch<React.SetStateAction<string>>
}

function SearchBar( {setSearchStr}: SearchBarProps ) {
    const [value, setValue] = useState<string>("")

    return (
        <form onSubmit={(e) => {e.preventDefault(); setSearchStr(value)}} className="search-bar-container">
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