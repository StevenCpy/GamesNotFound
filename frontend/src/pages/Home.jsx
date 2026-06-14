import { useContext } from 'react'
import './styling/Home.css'

// contexts
import { AuthContext } from "../components/contexts/AuthContext"

// utils
import devLog from "../../utils/logging/logging"

const COMPONENT = "Home"

function Home() {
    devLog(COMPONENT, "Home() called")
    const { currentUser } = useContext(AuthContext)

    return (
        <div id="homepage-container">
            <div id="homepage-message">
                {currentUser && <h1>Welcome back, {currentUser}!</h1>}
                <p>
                    Welcome to GamesNotFound!<br />
                    This platform allows users to play games on the browser.<br />
                    It is still under development.  Feel free to message me if you find any issues.
                </p>
                
                <p>
                    Thank you,<br />
                    Steven
                </p>
            </div>
            

            <div>
                <h2 className="header-title text-red">CURRENT FEATURES:</h2>
                <ul>
                    <li><span className="text-green">AUTH:</span> Register, Login, and persistent login using JWT authentication</li>
                    <li><span className="text-green">STORE:</span> Browse games written in JS</li>
                    <li><span className="text-green">LIBRARY SYSTEM:</span> Add & remove games from Library</li>
                    <li><span className="text-green">PLAYABLE GAMES:</span> Play game from the Store by clicking on "Play"<br />
                        (Hit the Target is currently the only game but more to come!)
                    </li>
                    <li><span className="text-green">HIGH SCORE SYSTEM:</span> Your best score for each game is saved</li>
                </ul>
            </div>

            <div>
                <h2 className="header-title text-red">UPCOMING FEATURES AND IMPROVEMENTS:</h2>
                <ul>
                    <li>
                        <span className="text-green">✅Password Security: </span> Password encryption in database and
                        password masking & toggle when typing password
                    </li>
                    <li>
                        <span className="text-green">JWT Security: </span> JWT token expiration and 
                        switching to HTTPOnly cookie JWT authentication
                    </li>

                    <li><span className="text-green">Even more Security: </span> Better protected routes for restricted resources</li>
                    <li><span className="text-green">UI: </span> Dark mode and Profile page overhaul</li>
                    <li><span className="text-green">UX: </span> Sorting games in Store & Library, and search bar</li>
                    <li><span className="text-green">Feature: </span> Leaderboard system to compete with others!</li>
                    <li><span className="text-green">UI: </span> Complete overhaul of the site's layout</li>
                </ul>
            </div>

        </div>
    )
}

export default Home