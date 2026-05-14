import { useContext } from "react"
import { AuthContext } from "../components/Context"
import { useNavigate } from "react-router-dom"

function Profile() {
    const { currentUser, setCurrentUser } = useContext(AuthContext)
    const navigate = useNavigate()

    function handleLogout() {
        setCurrentUser(null)
        navigate("/")
        // clear JWT cookie + tell server that user logged out so it can invalidate token
    }

    return (
        <div
        style={{
            marginLeft: "auto",
            marginRight: "auto",
            width: "50rem",
            height: "20rem",
            fontSize: "150%",
            textAlign: "center"
        }}>
            {currentUser}<br></br>
            <button onClick={ handleLogout }>Log out</button>
        </div>
    )
}

export default Profile