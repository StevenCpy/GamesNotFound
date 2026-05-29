import { useContext } from "react"
import { AuthContext } from "../components/contexts/AuthContext"
import devLog from "../../utils/logging/logging"

const COMPONENT = "Home"

function Home() {
    devLog(COMPONENT, "Home() called")
    const { currentUser } = useContext(AuthContext)

    return (
        <div id="welcome-message"
        style={{
            marginLeft: "auto",
            marginRight: "auto",
            width: "50rem",
            height: "20rem",
            fontSize: "150%",
            textAlign: "center"
        }}>
            {currentUser && <div style={{ fontSize: "200%" }}>Welcome,<br></br> {currentUser}!</div>}
            Welcome to GamesNotFound<br></br>
            This platform allows users to play games on the browser.<br></br>
            It is still under development.  Feel free to message me if you find any issues.<br></br>
            Thank you,<br></br>
            Steven
        </div>
    )
}

export default Home