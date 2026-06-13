import { useEffect, useContext } from 'react'
import { Toaster } from 'sonner'
import './App.css'

// components
import AppRouter from './components/AppRouter'

// contexts
import { AuthContext } from './components/contexts/AuthContext'
import { StoreContext } from './components/contexts/StoreContext'
import { LibraryContext } from './components/contexts/LibraryContext'
import { HighscoreContext } from './components/contexts/HighscoreContext'
import { LoadingContext } from './components/contexts/LoadingContext'

// utils
import devLog from '../utils/logging/logging'
import delay from '../utils/delay'

const COMPONENT = "App"

function App() {
    devLog(COMPONENT, "App() called")
    const { currentUser, authenticateUsingToken } = useContext(AuthContext)
    const { loadStore } = useContext(StoreContext)
    const { loadLibrary, clearLibrary } = useContext(LibraryContext)
    const { loadHighScores, clearHighScores } = useContext(HighscoreContext)
    const { isLoading, startLoadingScreen, stopLoadingScreen } = useContext(LoadingContext)

    useEffect(() => {
        devLog(COMPONENT, "calling useEffect in App() - Authenticate using JWT token")
        authenticateUsingToken()
    }, [])

    useEffect(() => {
        devLog(COMPONENT, "calling useEffect in App() - Fetching Store, Library and High scores")

        async function loadStoreAndLibrary() {
            const store_response_json = await loadStore()
            if (store_response_json.status == "Success") {
                loadLibrary()
            }
        }

        const DELAY = 2000
        async function initLoggedOut() {
            loadStore()
            clearLibrary()
            clearHighScores()
            await delay(DELAY)
            stopLoadingScreen()
        }

        async function initLoggedIn() {
            loadStoreAndLibrary()
            loadHighScores()
            await delay(DELAY)
            stopLoadingScreen()
        }

        startLoadingScreen()
        if (!currentUser) { // user logged out
            initLoggedOut()
        } else { // user logged in
            initLoggedIn()
        }

    }, [currentUser]) // re-run code when user logs in/out

    return (
        <div id="app-container">
            <Toaster theme="dark" visibleToasts={1} />
            <AppRouter />
        </div>
    )
}

export default App