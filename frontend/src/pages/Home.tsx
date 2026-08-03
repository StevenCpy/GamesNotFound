import './styling/Home.css'

// contexts
import { useAuth } from "../components/contexts/AuthContext"

// components
import Section from "../components/texts/Section"

// utils
import devLog from "../utils/logging/logging"

const COMPONENT = "Home"

function Home() {
    devLog(COMPONENT, "Home() called")
    const { currentUser } = useAuth()

    return (
        <div id="homepage-container">
            <div id="homepage-message">
                {currentUser && <h1>Welcome back, <span className="text-green">{currentUser["username"]}</span>!</h1>}
                <p>
                    Welcome to GamesNotFound!<br />
                    This platform allows users to play browser games and is currently under development.<br />
                </p>
                <br />
                <p>
                    Feel free to message me if you find any issues.<br />
                    Thank you,<br />
                    Steven
                </p>
            </div>

            <Section title="CURRENT FEATURES:">
                <ul>
                    <li><span className="text-green bold">AUTH:</span> Register, Login, and persistent login using JWT authentication</li>
                    <li><span className="text-green bold">STORE:</span> Browse games written in JS/TS</li>
                    <li><span className="text-green bold">LIBRARY SYSTEM:</span> Add games to personal Library</li>
                    <li><span className="text-green bold">PLAYABLE GAMES:</span> Play games by interacting with game cards<br /></li>
                    <li><span className="text-green bold">HIGH SCORE SYSTEM:</span> Your best score for each game is saved</li>
                    <li><span className="text-green bold">STORE SORT AND SEARCH:</span> Search games and sort them by ID or name</li>
                    <li><span className="text-green bold">SECURITY:</span> Encrypted password and HTTP-Only JWT cookie with token expiration</li>
                    <li><span className="text-green bold">DARK/LIGHT MODE</span></li>
                    <li><span className="text-green bold">QUICK AUTH:</span> Quick signup for testing features with a temporary account<br />
                        (Account is deleted on log out)
                    </li>
                </ul>
            </Section>

            <Section title="UPCOMING FEATURES AND IMPROVEMENTS:">
                <ul>
                    <li>
                        <span className="text-green bold">✅JWT Security:</span> JWT token expiration and 
                        switching to HTTPOnly cookie JWT authentication
                    </li>

                    <li><span className="text-green bold">Even more Security:</span> Better protected routes for restricted resources</li>
                    <li><span className="text-green bold">Feature:</span> Leaderboard system to compete with others!</li>
                    <li><span className="text-green bold">UI:</span> Complete overhaul of the site's layout</li>
                    <li><span className="text-green bold">Game making:</span> SDK for game creation</li>
                    <li><span className="text-green bold">Gamer feedback:</span> Game comments and ratings</li>
                </ul>
            </Section>

        </div>
    )
}

export default Home