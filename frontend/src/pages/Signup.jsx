import { useState } from 'react'
import { Link } from 'react-router-dom'

function Signup() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [signedUp, setSignedUp] = useState(false)
    
    const usernameMaxLength = 30
    const emailMaxLength = 255
    const passwordMaxLength = 128

    function handleField(e, setField, fieldMaxLength) {
        if (e.target.value.length < fieldMaxLength) {
            setField(e.target.value)
        }
    }

    function handleSignUp() {
        // TODO -- add backend logic for checking if email and username are available
        // TODO -- add password validation, password must follow regex
        setSignedUp(true)
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
                <span style={{ marginLeft: "auto", marginRight: "auto" }}>SIGN UP</span>
                <label>Username:</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => handleField(e, setUsername, usernameMaxLength)}
                />
                <label>Email:</label>
                <input
                    type="text"
                    value={email}
                    onChange={(e) => handleField(e, setEmail, emailMaxLength)}
                />
                <label>Password:</label>
                <input
                    type="text"
                    value={password}
                    onChange={(e) => handleField(e, setPassword, passwordMaxLength)}
                />
                {/* show this text only if username, email or password is blank */}
                {!(username && email && password) && <div style={{ color:"red" }} >Fill in all fields!</div>}
                <button disabled={!(username && email && password)} onClick={ handleSignUp }>Sign up</button>
                <span>
                    Already have an account?{" "}
                    <Link to="/Login">Login</Link>
                </span>



            </div>

        </form>
    )
}

export default Signup