import { createContext, useState, use, useEffect } from 'react'

// utils
import devLog from '../../utils/logging/logging'

const COMPONENT = "ThemeContext"

type ThemeContextType = {
    isDark: boolean
    setIsDark: React.Dispatch<React.SetStateAction<boolean>>
}

export const ThemeContext = createContext<ThemeContextType|null>(null)

export function ThemeProvider( {children}: {children: React.ReactNode} ) {
    devLog(COMPONENT, "called")

    const [isDark, setIsDark] = useState<boolean>(() => {
        const savedTheme = localStorage.getItem("theme")
        return (savedTheme !== "light")
        // HTML element has "dark" theme by default
    })

    useEffect(() => {
        // save theme to localStorage on toggle, and toggle light-theme class on HTML element
        localStorage.setItem("theme", isDark ? "dark" : "light")
        isDark ?
                document.documentElement.classList.remove("light-theme")
                : document.documentElement.classList.add("light-theme")
    }, [isDark])

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