import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SERVER_URL from '../data/server_variables'
import { AuthContext } from '../components/Context'

function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loginError, setLoginError] = useState(false)
    const { setCurrentUser } = useContext(AuthContext)
    const navigate = useNavigate()

    // send login request to server
    async function handleLoginServer() {
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
            const data = await response.json()
            return data
        } catch (error) {
            console.error("Error calling login API", error)
            return {"status": "Fail", "details": "Error calling login API"}
        }
    }

    async function handleLogin(e) {
        e.preventDefault() // prevent re-rendering whole App() on submit/pressing "Login" button

        console.log("Initiating server-side login...")

        // send request to server to handle login
        let data = await handleLoginServer()
        if (data.status == "Success") {
            console.log("User successfully logged in by server")
            setCurrentUser(username.toUpperCase())
            navigate("/")
        } else {
            console.log(data.details)
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