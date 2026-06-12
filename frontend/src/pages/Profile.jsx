import { useContext } from "react"
import { useNavigate } from "react-router-dom"

import { AuthContext } from "../components/contexts/AuthContext"

import './styling/Profile.css'

import devLog from "../../utils/logging/logging"

const COMPONENT = "Profile"

function Profile() {
    devLog(COMPONENT, "Profile() called")
    const { currentUser, setCurrentUser } = useContext(AuthContext)
    const navigate = useNavigate()

    function handleLogout() {
        devLog(COMPONENT, "handleLogout() called")

        setCurrentUser(null)
        localStorage.removeItem("token") // clear token from localStorage
        navigate("/")

        // clear JWT cookie + tell server that user logged out so it can invalidate token
    }

    return (
        <div id="profile-container">
            {currentUser}<br />
            <button onClick={ handleLogout }>Log out</button>
        </div>
    )
}

export default Profile