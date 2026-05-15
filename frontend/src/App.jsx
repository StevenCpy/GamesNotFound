import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Store from './pages/Store'
import Library from './pages/Library'
import Profile from './pages/Profile'
import Signup from './pages/Signup'
import Login from './pages/Login'
import { AuthContext } from './components/Context.jsx'

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [library, setLibrary] = useState({})

  return (
    <AuthContext value={{ currentUser, setCurrentUser, library, setLibrary }}>
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