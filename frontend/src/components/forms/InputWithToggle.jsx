import { useState } from 'react'
import './InputWithToggle.css'

function InputWithToggle( {type, value, maxLength, setValue} ) {
    const [hide, setHide] = useState(true)
    const dynamicType = hide ? "password" : "text" // hide = true: input type set to "password" to hide password

    const props = maxLength ? {type: dynamicType, value, maxLength} : {type: dynamicType, value}
    return (
        <div id="input-with-toggle-container">
            <input
                {...props}
                onChange={(e) => setValue(e.target.value)}
            />
            <div id="toggle-and-text">
                <input type="checkbox" onChange={() => setHide(prev => !prev)} />
                <p>{hide ? "Show" : "Hide"} {type}</p>
            </div>
        </div>
    )
}

export default InputWithToggle