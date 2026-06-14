import './SearchBar.css'

function SortDropdown( {sortBy, setSortBy, options} ) {
    return (
        <div className="sort-container">
            <label>Sort:</label>

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option disabled>SORT BY</option>
                {options.map(option => 
                    <option value={option.value}>{option.label}</option>
                )}
            </select>
        </div>
    )
}

export default SortDropdown