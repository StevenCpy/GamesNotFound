import { useContext } from 'react'
import './styling/Home.css'

// contexts
import { AuthContext } from "../components/contexts/AuthContext"

// components
import Section from "../components/texts/Section"

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
                    <li><span className="text-green bold">STORE:</span> Browse games written in JS</li>
                    <li><span className="text-green bold">LIBRARY SYSTEM:</span> Add & remove games from Library</li>
                    <li><span className="text-green bold">PLAYABLE GAMES:</span> Play game from the Store by clicking on "Play"<br />
                        (Hit the Target is currently the only game but more to come!)
                    </li>
                    <li><span className="text-green bold">HIGH SCORE SYSTEM:</span> Your best score for each game is saved</li>
                    <li><span className="text-green bold">STORE SORTING:</span> Sort games by ID or name</li>
                    <li><span className="text-green bold">GAME SEARCHING:</span> Search games by name</li>
                </ul>
            </Section>

            <Section title="UPCOMING FEATURES AND IMPROVEMENTS:">
                <ul>
                    <li>
                        <span className="text-green bold">✅Password Security:</span> Password encryption in database and
                        password masking & toggle when typing password
                    </li>
                    <li>
                        <span className="text-green bold">JWT Security:</span> JWT token expiration and 
                        switching to HTTPOnly cookie JWT authentication
                    </li>

                    <li><span className="text-green bold">Even more Security:</span> Better protected routes for restricted resources</li>
                    <li><span className="text-green bold">UI:</span> Dark mode and Profile page overhaul</li>
                    <li><span className="text-green bold">✅UX:</span> Sorting games in Store & Library, and search bar</li>
                    <li><span className="text-green bold">Feature:</span> Leaderboard system to compete with others!</li>
                    <li><span className="text-green bold">UI:</span> Complete overhaul of the site's layout</li>
                </ul>
            </Section>

        </div>
    )
}

export default Home