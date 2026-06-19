import './SortDropdown.css'

type sortOption = {
    value: string
    label: string
}

type SortDropdownProps = {
    sortBy: string
    onChange: (e: React.ChangeEvent<HTMLSelectElement, HTMLSelectElement>) => void
    options: sortOption[]
}

function SortDropdown( {sortBy, onChange, options}: SortDropdownProps ) {
    return (
        <div className="sort-dropdown-container">
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