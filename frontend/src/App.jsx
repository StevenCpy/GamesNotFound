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
import SERVER_URL from './data/server_variables.js'

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [storeList, setStoreList] = useState([]) // list for displaying store games
  const [libraryList, setLibraryList] = useState([]) // list for displaying library games in order
  const [librarySet, setLibrarySet] = useState(new Set()) // set for quick lookups of library games

  useEffect(() => {
    console.log("calling useEffect in App()")

    async function loadStoreServer() {
      try {
        const response = await fetch(`${SERVER_URL}/store`)
        const response_json = await response.json()
        return response_json
      } catch (error) {
        console.error("Error calling store API", error)
        return {"status": "Fail", "details": "Error calling store API"}
      }
    }

    async function loadLibraryServer() {
      try {
        const response = await fetch(`${SERVER_URL}/library`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username: currentUser
          })
        })
        const response_json = await response.json()
        return response_json
      } catch (error) {
        console.error("Error calling library API", error)
        return {"status": "Fail", "details": "Error calling library API"}
      }
    }

    async function loadStoreOnlyServer() {
      const store_response_json = await loadStoreServer()

      if (store_response_json.status == "Success") {
        // initialize store games lists
        setStoreList(store_response_json.data)
      }
    }

    async function loadStoreAndLibraryServer() {
      const store_response_json = await loadStoreServer()
      const library_response_json = await loadLibraryServer()

      if (store_response_json.status == "Success" && library_response_json.status == "Success") {
        // initialize store and library games lists
        setStoreList(store_response_json.data)
        setLibraryList(library_response_json.data)

        // convert libraryList to a set containing only gameIDs
        setLibrarySet(new Set(library_response_json.data.map(game => game.gameID)))
      }
    }

    if (currentUser) {
      loadStoreAndLibraryServer()
    } else { // user logged out
      // keep store list as users should see the store games even when logged out
      loadStoreOnlyServer()
      setLibraryList([])
    }

  }, [currentUser]) // re-run code in case user logs in/logs out

  return (
    // currentUser used by Profile and Home pages
    // setCurrentUser used by Login and Log out features
    // libraryList used by Library to display library games, and Store to disable "+ Add to library button"
    // setLibraryList used by Store whenever user adds game to library, and Library to remove a game
    // storeList used by Store to display store games, and Library to check for game info
    <AuthContext value={{ currentUser, setCurrentUser, libraryList, setLibraryList, storeList }}>
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
            <span style={{ marginLeft:"auto" }}>
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