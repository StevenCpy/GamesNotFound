import { useContext } from "react"

import { AuthContext } from "../components/contexts/AuthContext"
import './styling/Home.css'

import devLog from "../../utils/logging/logging"

const COMPONENT = "Home"

function Home() {
    devLog(COMPONENT, "Home() called")
    const { currentUser } = useContext(AuthContext)

    return (
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
    )
}

export default Home