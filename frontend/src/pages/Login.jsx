import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SERVER_URL from '../data/server_variables'
import { AuthContext } from '../components/Context'
import devLog from "../../test/logging"

const COMPONENT = "Login"

function Login() {
    devLog(COMPONENT, "Login() called")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loginError, setLoginError] = useState(false)
    const { setCurrentUser } = useContext(AuthContext)
    const navigate = useNavigate()

    // send login POST request to server
    async function handleLoginServer() {
        devLog(COMPONENT, "handleLoginServer() called")
        try {
            const response = await fetch(`${SERVER_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            })
            const response_json = await response.json()
            return response_json
        } catch (error) {
            console.error("Error calling login API", error)
            return {"status": "Fail", "details": "Error calling login API"}
        }
    }

    async function handleLogin(e) {
        devLog(COMPONENT, "handleLogin() called.  Initiating server-side login...")
        e.preventDefault() // prevent re-rendering whole App() on submit/pressing "Login" button

        // send request to server to handle login
        const response_json = await handleLoginServer()
        if (response_json.status == "Success") {
            devLog(COMPONENT, `User "${username.toUpperCase()}" successfully logged in by server`)
            setCurrentUser(username.toUpperCase())
            navigate("/")
        } else {
            devLog(COMPONENT, `Login failed.  Server error details - ${response_json.details}`)
            setLoginError(true)
        }
    }

    return (
        <form>
            <div style={{
                display:"flex",
                flexDirection: "column",
                marginLeft: "auto",
                marginRight: "auto",
                width: "15rem",
                height: "20rem"
            }}>
                <span style={{ marginLeft: "auto", marginRight: "auto" }}>LOGIN</span>
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
                    <Link to="/Signup">Sign up</Link>
                </span>
                {loginError && <div style={{ color:"red" }}> Incorrect username or password!  Please try again.</div>}
            </div>
        </form>
    )
}

export default Login