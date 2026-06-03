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
                    <Link to="/store">STORE</Link>
                    {currentUser && <Link to="/library">LIBRARY</Link>}
                    <Link to="/news">What's NEW</Link>
                </span>

                <span style={{
                    marginLeft: "auto",
                    display: "flex",
                    gap: "30px"
                }}>
                    {import.meta.env.DEV && <Link to="/games/HitTheTarget">LINK FOR TESTING</Link>}
                    {(!currentUser && import.meta.env.DEV) && <button onClick={() => setCurrentUser("Admin")}>Quick Login</button>}
                    {currentUser ?
                        <Link to="/profile">{currentUser}</Link> : <Link to="/login">Login</Link>
                    }
                </span>
            </div>
        </nav>
    )
}

export default NavbarMain