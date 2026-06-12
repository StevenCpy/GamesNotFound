import { useEffect, useContext } from 'react'
import './App.css'

import AppRouter from './components/AppRouter'

// contexts
import { AuthContext } from './components/contexts/AuthContext'
import { StoreContext } from './components/contexts/StoreContext'
import { LibraryContext } from './components/contexts/LibraryContext'
import { HighscoreContext } from './components/contexts/HighscoreContext'

// utils
import devLog from '../utils/logging/logging'

const COMPONENT = "App"

function App() {
    devLog(COMPONENT, "App() called")
    const { currentUser, authenticateUsingToken } = useContext(AuthContext)
    const { loadStore } = useContext(StoreContext)
    const { loadLibrary, clearLibrary } = useContext(LibraryContext)
    const { loadHighScores, clearHighScores } = useContext(HighscoreContext)

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

        if (!currentUser) { // user logged out
            loadStore()
            clearLibrary()
            clearHighScores()
        } else { // user logged in
            loadStoreAndLibrary()
            loadHighScores()
        }

    }, [currentUser]) // re-run code when user logs in/out

    return (
        <div id="app-container">
            <AppRouter />
        </div>
    )
}

export default App