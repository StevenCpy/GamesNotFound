import { useState } from 'react'
import './PasswordInputWithToggle.css'

type PasswordInputWithToggleProps = {
    password: string
    maxLength?: number
    setPassword: React.Dispatch<React.SetStateAction<string>>
}

function PasswordInputWithToggle( {password, maxLength, setPassword}: PasswordInputWithToggleProps ) {
    const [hide, setHide] = useState<boolean>(true)
    const dynamicType = hide ? "password" : "text" // hide = true: input type set to "password" to hide password

    const props = maxLength ? {type: dynamicType, value: password, maxLength} : {type: dynamicType, value: password}
    return (
        <div id="input-with-toggle-container">
            <input
                {...props}
                onChange={(e) => setPassword(e.target.value)}
            />
            <div id="toggle-and-text">
                <input type="checkbox" onChange={() => setHide(prev => !prev)} />
                <p>{hide ? "Show" : "Hide"} password</p>
            </div>
        </div>
    )
}

export default PasswordInputWithToggle