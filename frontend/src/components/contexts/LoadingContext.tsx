import { createContext, useState, use } from 'react'

const COMPONENT = "LoadingProvider"

type LoadingContextType = {
    isLoading: boolean
    startLoadingScreen: () => void
    stopLoadingScreen: () => void
}

export const LoadingContext = createContext<LoadingContextType|null>(null)

export function LoadingProvider( {children}: {children: React.ReactNode} ) {
    const [isLoading, setIsLoading] = useState<boolean>(true)

    function startLoadingScreen(): void {
        setIsLoading(true)
    }

    function stopLoadingScreen(): void {
        setIsLoading(false)
    }

    return (
        <LoadingContext value={{ isLoading, startLoadingScreen, stopLoadingScreen }}>
            {children}
        </LoadingContext>
    )
}

export function useLoading() {
    const loadingContext = use(LoadingContext)

    if (!loadingContext) {
        throw new Error("LoadingContext is null")
    }

    return loadingContext
}