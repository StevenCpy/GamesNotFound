import { useEffect, useContext } from 'react'
import './App.css'

import AppRouter from './components/AppRouter'

// contexts
import { AuthContext } from './components/contexts/AuthContext'
import { StoreContext } from './components/contexts/StoreContext'
import { LibraryContext } from './components/contexts/LibraryContext'

// utils
import devLog from '../utils/logging/logging'
import apiRequest from '../utils/apiRequest'

const COMPONENT = "App"

function App() {
    devLog(COMPONENT, "App() called")
    const { currentUser } = useContext(AuthContext)
    const { setStoreList } = useContext(StoreContext)
    const { setLibraryList, setLibrarySet } = useContext(LibraryContext)

    useEffect(() => {
        devLog(COMPONENT, "calling useEffect in App()")

        async function loadStoreOnlyServer() {
            devLog(COMPONENT, "loadStoreOnlyServer() called")
            const store_response_json = await apiRequest(COMPONENT, "store", "GET") // send GET request to fetch Store from server

            if (store_response_json.status == "Success") {
                devLog(COMPONENT, "Store fetched")
                // initialize store games list
                setStoreList(store_response_json.data)
            }
            setLibraryList([])
        }

        async function loadStoreAndLibraryServer() {
            devLog(COMPONENT, "loadStoreAndLibraryServer() called")
            const store_response_json = await apiRequest(COMPONENT, "store", "GET") // send GET request to fetch Store from server
            const library_response_json = await apiRequest(COMPONENT, `library/${currentUser}`, "GET") // send GET request to fetch Library from server

            if (store_response_json.status == "Success" && library_response_json.status == "Success") {
                devLog(COMPONENT, "Store and Library fetched")
                // initialize store and library games lists
                setStoreList(store_response_json.data)
                setLibraryList(library_response_json.data)

                // convert libraryList to a set containing only gameIDs
                setLibrarySet(new Set(library_response_json.data.map(game => game.gameID)))
            }
        }

        if (!currentUser) {
            loadStoreOnlyServer() // fetch only Store games if user logged out
        } else { // user logged in
            loadStoreAndLibraryServer() // fetch both Store and Library games if user logged in
        }

    }, [currentUser]) // re-run code in case user logs in/logs out

    return (
        <div id="app-container">
            <AppRouter />
        </div>
    )
}

export default App