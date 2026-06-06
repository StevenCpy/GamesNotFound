import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { AuthContext } from '../components/contexts/AuthContext'
import './styling/Auth.css'

import devLog from "../../utils/logging/logging"
import apiRequest from '../../utils/apiRequest'

const COMPONENT = "Login"

function Login() {
    devLog(COMPONENT, "Login() called")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loginError, setLoginError] = useState(false)
    const { setCurrentUser } = useContext(AuthContext)
    const navigate = useNavigate()

    async function handleLogin(e) {
        devLog(COMPONENT, "handleLogin() called.  Initiating server-side login...")
        e.preventDefault() // prevent re-rendering whole App() on submit/pressing "Login" button

        // send login POST request to server to handle login
        const response_json = await apiRequest(COMPONENT, "auth/login", "POST", { username: username, password: password })
        if (response_json.status == "Success") {
            devLog(COMPONENT, `User "${username.toUpperCase()}" successfully logged in by server`)
            // store JWT token received from server
            localStorage.setItem("token", response_json.token)

            setCurrentUser(username.toUpperCase())
            navigate("/")
        } else {
            devLog(COMPONENT, `Login failed.  Server error details - ${response_json.details}`)
            setLoginError(true)
        }
    }

    return (
        <form id="auth-form">
            <h3>LOGIN</h3>

            <label>Username:</label>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <label>Password:</label>
            <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button disabled={!(username && password)} onClick={ handleLogin }>Login</button>
            <span>
                Don't have an account?{" "}
                <Link to="/signup">Sign up</Link>
            </span>
            {loginError && <p className="text-fail"> Incorrect username or password!  Please try again.</p>}
        </form>
    )
}

export default Login