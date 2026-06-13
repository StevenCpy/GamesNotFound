import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './styling/Auth.css'

// contexts
import { AuthContext } from '../components/contexts/AuthContext'

// utils
import devLog from "../../utils/logging/logging"

const COMPONENT = "Login"

function Login() {
    devLog(COMPONENT, "Login() called")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loginError, setLoginError] = useState(false)
    const { loginServer } = useContext(AuthContext)
    const navigate = useNavigate()

    async function handleLogin(e) {
        devLog(COMPONENT, "handleLogin() called.  Initiating server-side login...")
        e.preventDefault() // prevent re-rendering whole App() on submit/pressing "Login" button

        const response_json = await loginServer(username, password)
        if (response_json.status == "Success") {
            navigate("/")
        } else {
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
            {loginError && <p className="text-fail">Incorrect username or password!  Please try again.</p>}
        </form>
    )
}

export default Login