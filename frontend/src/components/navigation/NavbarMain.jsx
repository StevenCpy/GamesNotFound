import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from "../contexts/AuthContext"

function NavbarMain() {
    const { currentUser, setCurrentUser } = useContext(AuthContext)

    return (
        <nav id="main-nav-bar">
            <div style={{
                display: "flex",
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
                    marginLeft: "auto",
                    display: "flex",
                    gap: "30px"
                }}>
                    {(!currentUser && import.meta.env.DEV) && <button onClick={() => setCurrentUser("Admin")}>Quick Login</button>}
                    {currentUser ?
                        <Link to="/Profile">{currentUser}</Link> : <Link to="/Login">Login</Link>
                    }
                </span>
            </div>
        </nav>
    )
}

export default NavbarMain