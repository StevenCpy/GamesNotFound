import { createContext, useState, use, useMemo } from 'react'

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

    const theme = useMemo(() => localStorage.getItem("theme"), [])
    const [isDark, setIsDark] = useState<boolean>(theme === "dark")

    // save theme to localStorage on toggle
    localStorage.setItem("theme", isDark ? "dark" : "light")

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