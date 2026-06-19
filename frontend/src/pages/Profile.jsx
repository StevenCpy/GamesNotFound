import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import './styling/Profile.css'

// contexts
import { AuthContext } from "../components/contexts/AuthContext"

// utils
import devLog from "../utils/logging/logging"
import isoToLocaleDateString from "../utils/isoToLocaleDateString"

const COMPONENT = "Profile"

const DEFAULT_PROFILE_PIC_URL = "/profile-picture/default profile pic.jpg"

function Profile() {
    devLog(COMPONENT, "Profile() called")
    const { currentUser, setCurrentUser } = useContext(AuthContext)

    const navigate = useNavigate()

    function handleLogout() {
        devLog(COMPONENT, "handleLogout() called")

        setCurrentUser(null)
        localStorage.removeItem("token") // clear token from localStorage
        navigate("/")

        toast(`Successfully logged out!`)

        // clear JWT cookie + tell server that user logged out so it can invalidate token
    }

    const username = currentUser ? currentUser["username"] : null
    const createdAt = currentUser ? isoToLocaleDateString(currentUser["created_at"]) : null
    const profilePicURL = currentUser ? currentUser["profile_pic_url"] : null

    return (
        <div id="profile-page-container">
            <div id="profile-card">
                <div id="profile-pic-container">
                    <img src={profilePicURL ?? DEFAULT_PROFILE_PIC_URL} alt="profile picture"/>
                </div>
                <div id="profile-info-container">
                    <p className="text-green bold">{username}</p>
                    <p><span className="bold">ACCOUNT CREATED ON: </span>{createdAt}</p>
                    <button onClick={ handleLogout }>Log out</button>
                </div>
            </div>
            
        </div>
    )
}

export default Profile