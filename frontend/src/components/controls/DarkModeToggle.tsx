import { FiSun, FiMoon } from 'react-icons/fi'
import './DarkModeToggle.css'

// contexts
import { useTheme } from '../contexts/ThemeContext'

function DarkModeToggle( ) {
    const { isDark, setIsDark } = useTheme()
    console.log("isDark", isDark)

    return (
        <div id="dark-mode-toggle-container">
            <label>
                <input id="dark-mode-toggle"
                    type="checkbox"
                    checked={isDark}
                    onChange={() => setIsDark(prev => !prev)}
                />
                <span id="dark-mode-icon">{isDark ? <FiMoon /> : <FiSun />}</span>
            </label>
        </div>
        
    )
}

export default DarkModeToggle