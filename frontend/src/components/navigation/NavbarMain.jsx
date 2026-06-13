import { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import './NavbarMain.css'

// contexts
import { AuthContext } from "../contexts/AuthContext"

function NavbarMain() {
    const { currentUser, quickLogin } = useContext(AuthContext)

    return (
        <nav id="main-navbar">
            <span id="main-navbar-left">
                <NavLink to="/">GamesNotFound</NavLink>
                <NavLink to="/store">STORE</NavLink>
                {currentUser && <NavLink to="/library">LIBRARY</NavLink>}
                <NavLink to="/news">What's NEW</NavLink>
            </span>

            <span id="main-navbar-right">
                {import.meta.env.DEV && <NavLink to="/games/HitTheTarget">LINK FOR TESTING</NavLink>}
                {(!currentUser && import.meta.env.DEV) && <button onClick={() => quickLogin("Admin")}>Quick Login</button>}
                {currentUser ?
                    <NavLink to="/profile">{currentUser}</NavLink> : <NavLink to="/login">Login</NavLink>
                }
            </span>
        </nav>
    )
}

export default NavbarMain