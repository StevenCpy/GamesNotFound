import { useEffect } from 'react'
import { Toaster } from 'sonner'
import './App.css'

// components
import AppRouter from './components/AppRouter'

// contexts
import { useAuth } from './components/contexts/AuthContext'
import { useStore } from './components/contexts/StoreContext'
import { useLibrary } from './components/contexts/LibraryContext'
import { useHighscore } from './components/contexts/HighscoreContext'
import { useLoading } from './components/contexts/LoadingContext'

// utils
import devLog from './utils/logging/logging'
import delay from './utils/delay'

const COMPONENT = "App"

function App() {
    devLog(COMPONENT, "App() called")
    const { currentUser, authenticateUsingToken } = useAuth()
    const { loadStore } = useStore()
    const { loadLibrary, clearLibrary } = useLibrary()
    const { loadHighScores, clearHighScores } = useHighscore()
    const { startLoadingScreen, stopLoadingScreen } = useLoading()

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

        const DELAY = 1500
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