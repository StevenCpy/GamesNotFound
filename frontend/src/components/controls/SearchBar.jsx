import './SearchBar.css'

function SortDropdown( {sortBy, onChange, options} ) {
    return (
        <div className="sort-container">
            <label>Sort:</label>

            <select value={sortBy} onChange={onChange}>
                <option disabled>SORT BY</option>
                {options.map(option => 
                    <option key={option.value} value={option.value}>{option.label}</option>
                )}
            </select>
        </div>
    )
}

export default SortDropdown