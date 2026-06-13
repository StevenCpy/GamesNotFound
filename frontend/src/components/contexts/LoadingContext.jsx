import { createContext, useState } from 'react'

const COMPONENT = "LoadingProvider"

export const LoadingContext = createContext(null)

export function LoadingProvider( {children} ) {
    const [isLoading, setIsLoading] = useState(true)

    function startLoadingScreen() {
        setIsLoading(true)
    }

    function stopLoadingScreen() {
        setIsLoading(false)
    }

    return (
        <LoadingContext value={{ isLoading, startLoadingScreen, stopLoadingScreen }}>
            {children}
        </LoadingContext>
    )
}