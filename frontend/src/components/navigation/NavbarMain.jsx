import { useContext } from 'react'
import { Link } from 'react-router-dom'

import { AuthContext } from "../contexts/AuthContext"
import './NavbarMain.css'

function NavbarMain() {
    const { currentUser, setCurrentUser } = useContext(AuthContext)

    return (
        <nav id="main-navbar">
            <span id="main-navbar-left">
                <Link to="/">GamesNotFound</Link>
                <Link to="/store">STORE</Link>
                {currentUser && <Link to="/library">LIBRARY</Link>}
                <Link to="/news">What's NEW</Link>
            </span>

            <span id="main-navbar-right">
                {import.meta.env.DEV && <Link to="/games/HitTheTarget">LINK FOR TESTING</Link>}
                {(!currentUser && import.meta.env.DEV) && <button onClick={() => setCurrentUser("Admin")}>Quick Login</button>}
                {currentUser ?
                    <Link to="/profile">{currentUser}</Link> : <Link to="/login">Login</Link>
                }
            </span>
        </nav>
    )
}

export default NavbarMain