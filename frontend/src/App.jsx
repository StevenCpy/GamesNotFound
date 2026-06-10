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
    const { currentUser, setCurrentUser } = useContext(AuthContext)
    const { setStoreList } = useContext(StoreContext)
    const { setLibraryList, setLibrarySet } = useContext(LibraryContext)
    const { setHighscoreHashMap } = useContext(HighscoreContext)

    useEffect(() => {
        devLog(COMPONENT, "calling useEffect in App() - Authenticate using JWT token")

        async function getUsernameFromToken() {
            // send GET request to fetch username from server
            const token = localStorage.getItem("token") // get JWT token from localStorage
            const auth_response_json = await apiRequest(COMPONENT, "auth/me", "GET", null, token)
            if (auth_response_json.status == "Success") {
                setCurrentUser(auth_response_json.username)
            }
        }

        getUsernameFromToken()
    }, [])

    useEffect(() => {
        devLog(COMPONENT, "calling useEffect in App() - Fetching Store and Library")

        async function loadStoreOnlyServer() {
            devLog(COMPONENT, "loadStoreOnlyServer() called")
            const store_response_json = await apiRequest(COMPONENT, "store/", "GET") // send GET request to fetch Store from server

            if (store_response_json.status == "Success") {
                devLog(COMPONENT, "Store fetched")
                // initialize store games list
                setStoreList(store_response_json.data)
            }
        }

        async function loadStoreAndLibraryServer() {
            devLog(COMPONENT, "loadStoreAndLibraryServer() called")
            // send GET request to fetch Store from server
            const store_response_json = await apiRequest(COMPONENT, "store/", "GET")

            // send GET request to fetch Library from server
            const token = localStorage.getItem("token") // get JWT token from localStorage
            const library_response_json = await apiRequest(COMPONENT, "library/", "GET", null, token)

            if (store_response_json.status == "Success" && library_response_json.status == "Success") {
                devLog(COMPONENT, "Store and Library fetched")
                // initialize store and library games lists
                setStoreList(store_response_json.data)
                setLibraryList(library_response_json.data)

                // convert libraryList to a set containing only gameIDs
                setLibrarySet(new Set(library_response_json.data.map(game => game.gameID)))
            }
        }

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

        // user logged out
        if (!currentUser) { 
            loadStoreOnlyServer() // fetch only Store games
            setLibraryList([]) // clear Library
            setHighscoreHashMap(new Map()) // clear high scores
        // user logged in
        } else {
            loadStoreAndLibraryServer() // fetch both Store and Library games
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