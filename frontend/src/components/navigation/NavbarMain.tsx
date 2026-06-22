import { NavLink } from 'react-router-dom'
import './NavbarMain.css'

// contexts
import { useAuth } from "../contexts/AuthContext"

// components
import DarkModeToggle from "../controls/DarkModeToggle"

function NavbarMain() {
    const { currentUser, quickLogin } = useAuth()

    return (
        <nav id="main-navbar">
            <span id="main-navbar-left">
                <NavLink to="/">GamesNotFound</NavLink>
                <NavLink to="/store">STORE</NavLink>
                {currentUser && <NavLink to="/library">LIBRARY</NavLink>}
                <NavLink to="/news">What's NEW</NavLink>
            </span>

            <span id="main-navbar-right">
                {(!currentUser && import.meta.env.DEV) && <button onClick={() => quickLogin()}>Quick Login</button>}
                {currentUser ?
                    <NavLink to="/profile">{currentUser["username"]}</NavLink> : <NavLink to="/login">Login</NavLink>
                }
                <DarkModeToggle />
            </span>
        </nav>
    )
}

export default NavbarMain