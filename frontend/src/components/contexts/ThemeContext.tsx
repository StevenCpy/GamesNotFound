import { createContext, useState, use } from 'react'

// utils
import devLog from '../../utils/logging/logging'

const COMPONENT = "ThemeProvider"

type ThemeContextType = {
    isDark: boolean
    setIsDark: React.Dispatch<React.SetStateAction<boolean>>
}

export const ThemeContext = createContext<ThemeContextType|null>(null)

export function ThemeProvider( {children}: {children: React.ReactNode} ) {
    devLog(COMPONENT, "called")

    const [isDark, setIsDark] = useState<boolean>(() => {
        const savedTheme = localStorage.getItem("theme")
        if (savedTheme === "light") {
            document.documentElement.classList.add("light-theme")
        } // HTML element has "dark" theme by default
        return (savedTheme === "dark")
    })

    // save theme to localStorage on toggle, and toggle theme class on HTML element
    localStorage.setItem("theme", isDark ? "dark" : "light")
    document.documentElement.classList.toggle("light-theme")

    return (
        <ThemeContext value={{ isDark, setIsDark }}>
            {children}
        </ThemeContext>
    )
}

export function useTheme() {
    const themeContext = use(ThemeContext)

    if (!themeContext) {
        throw new Error("ThemeContext is null")
    }

    return themeContext
}