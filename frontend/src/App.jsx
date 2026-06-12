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
import apiRequest from '../utils/apiRequest'

const COMPONENT = "App"

function App() {
    devLog(COMPONENT, "App() called")
    const { currentUser, authenticateUsingToken } = useContext(AuthContext)
    const { loadStore } = useContext(StoreContext)
    const { loadLibrary, clearLibrary } = useContext(LibraryContext)
    const { setHighscoreHashMap } = useContext(HighscoreContext)

    useEffect(() => {
        devLog(COMPONENT, "calling useEffect in App() - Authenticate using JWT token")
        authenticateUsingToken()
    }, [])

    useEffect(() => {
        devLog(COMPONENT, "calling useEffect in App() - Fetching Store and Library")

        async function loadHighScoresServer() {
            devLog(COMPONENT, "loadHighScoresServer() called")

            // send GET request to fetch high scores from server
            const token = localStorage.getItem("token") // get JWT token from localStorage
            const highscores_response_json = await apiRequest(COMPONENT, "score/highscores", "GET", null, token)
            if (highscores_response_json.status == "Success") {
                devLog(COMPONENT, "High scores fetched")
                // initialize high score hash map
                const highscoreList = highscores_response_json.data
                const highscoreHashMap = new Map(
                    highscoreList.map(game => [game.gameID, game])
                )
                setHighscoreHashMap(highscoreHashMap)
            }
        }

        async function loadStoreAndLibrary() {
            const store_response = await loadStore()
            if (store_response == "Success") {
                loadLibrary()
            }
        }

        // user logged out
        if (!currentUser) { 
            loadStore() // fetch Store games
            clearLibrary() // clear Library
            setHighscoreHashMap(new Map()) // clear high scores
        // user logged in
        } else {
            loadStoreAndLibrary() // fetch Store and Library games
            loadHighScoresServer() // fetch high scores
        }

    }, [currentUser]) // re-run code in case user logs in/logs out

    return (
        <div id="app-container">
            <AppRouter />
        </div>
    )
}

export default App