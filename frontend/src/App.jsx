import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Store from './pages/Store'
import Library from './pages/Library'
import Profile from './pages/Profile'
import Signup from './pages/Signup'
import Login from './pages/Login'
import { AuthContext } from './components/Context.jsx'
import devLog from '../utils/logging/logging.jsx'
import apiRequest from '../utils/apiRequest.jsx'

const COMPONENT = "App"

function App() {
  devLog(COMPONENT, "App() called")
  const [currentUser, setCurrentUser] = useState(null)
  const [storeList, setStoreList] = useState([]) // list for displaying store games
  const [libraryList, setLibraryList] = useState([]) // list for displaying library games in order
  const [librarySet, setLibrarySet] = useState(new Set()) // set for quick lookups of library games

  useEffect(() => {
    devLog(COMPONENT, "calling useEffect in App()")

    async function loadStoreOnlyServer() {
      devLog(COMPONENT, "loadStoreOnlyServer() called")
      const store_response_json = await apiRequest(COMPONENT, "store", "GET") // send GET request to fetch Store from server

      if (store_response_json.status == "Success") {
        devLog(COMPONENT, "Store fetched")
        // initialize store games lists
        setStoreList(store_response_json.data)
      }
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

    if (currentUser) {
      loadStoreAndLibraryServer() // fetch both Store and Library games if user logged in
    } else { // user logged out
      loadStoreOnlyServer() // fetch only Store games if user logged out
      setLibraryList([])
    }

  }, [currentUser]) // re-run code in case user logs in/logs out

  return (
    // currentUser used by Profile and Home pages
    // setCurrentUser used by Login and Log out features
    // libraryList used by Library to display library games
    // setLibraryList used by Store whenever user adds game to library, and Library to remove a game
    // librarySet used by Store to disable "+ Add to library button"
    // setLibrarySet used by Store whenever user adds game to library, and Library to remove a game
    // storeList used by Store to display store games, and Library to check for game info
    <AuthContext value={{ currentUser, setCurrentUser, libraryList, setLibraryList, librarySet, setLibrarySet, storeList }}>
      <BrowserRouter>
        <nav id="main-nav-bar">
          <div style={{
              display:"flex",
              flexDirection: "row",
          }}>
            <span style={{
              display: "flex",
              gap: "30px"
            }}>
              <Link to="/">GamesNotFound</Link>
              <Link to="/Store">STORE</Link>
              {currentUser && <Link to="/Library">LIBRARY</Link>}
            </span>
            <span style={{
              marginLeft:"auto",
              display: "flex",
              gap: "30px"
            }}>
              {(!currentUser && import.meta.env.DEV) && <button onClick={ () => setCurrentUser("Admin") }>Quick Login</button>}
              {currentUser ?
                <Link to="/Profile">{currentUser}</Link> : <Link to="/Login">Login</Link>
              }
            </span>

          </div>
        </nav>

        <Routes>
          <Route path="/" element={ <Home /> } />
          <Route path="/Store" element={ <Store /> } />
          <Route path="/Library" element={ <Library /> } />
          <Route path="/Profile" element={ <Profile /> } />
          <Route path="/Signup" element={ <Signup /> } />
          <Route path="/Login" element={ <Login /> } />
        </Routes>
      </BrowserRouter>
    </AuthContext>
  )
}

export default App