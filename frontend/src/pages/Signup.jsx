import { useState } from 'react'
import { Link } from 'react-router-dom'

const SERVER_URL = "https://gamesnotfound-server.onrender.com"

function Signup() {
    const [username, setUsername] = useState("")
    //const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [signedUp, setSignedUp] = useState(false)
    const [passwordWarning, setPasswordWarning] = useState(false)
    const [signUpDetails, setSignUpDetails] = useState("")
    
    const usernameMaxLength = 30
    //const emailMaxLength = 320
    const passwordMaxLength = 128

    function handleField(e, setField, fieldMaxLength) {
        if (e.target.value.length < fieldMaxLength) {
            setField(e.target.value)
        }
    }

    async function handleSignUpServer() {
        try {
            const response = await fetch(`${SERVER_URL}/signup`, {
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
            console.error("Error calling API", error)
            return {"status": "Fail", "details": "Error calling signup API"}
        }
    }

    async function handleSignUp(e) {
        // TODO -- add email validation, email must follow regex (removed email requirement when signing up)
        // TODO -- add password validation, password must follow regex
        e.preventDefault() // prevent re-rendering whole App() on submit/pressing "Sign Up" button
        if (passwordIsValid(password)) {
            console.log("Valid password.  Initiating server-side sign up...")

            // send request to server to handle sign up
            let data = await handleSignUpServer()
            if (data.status == "Success") {
                console.log("User successfully signed up by server")
                setSignedUp(true)
                setSignUpDetails("")
                setPasswordWarning(false)
            } else {
                console.log(data.details)
                setSignUpDetails(data.details)
                setSignedUp(false)
                setPasswordWarning(false)
            }
        } else {
            console.log("Invalid password")
            setPasswordWarning(true)
            setSignedUp(false)
            setSignUpDetails("")
        }
    }

    function passwordIsValid(password) {
        let hasLowercase = false
        let hasUppercase = false
        let hasNumber = false
        let hasSpecial = false

        const special_chars = ['!', '@']

        for (let i = 0; i < password.length; i++) {
            if ('a' <= password[i] && password[i] <= 'z') {
                hasLowercase = true
            } else if ('A' <= password[i] && password[i] <= 'Z') {
                hasUppercase = true
            } else if ('0' <= password[i] && password[i] <= '9') {
                hasNumber = true
            } else if (special_chars.includes(password[i])) {
                hasSpecial = true
            } else {
                return false
            }
            // do not stop loop early even if all conditions true, as we need to check for invalid characters
        }
        return (hasLowercase && hasUppercase && hasNumber && hasSpecial)
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
                <div>
                    WARNING:<br></br>
                    Passwords not currently encrypted so I can see them in the database.  Please consider this.<br></br>
                    I will remove this warning after I implement password hashing.
                </div>
                <span style={{ marginLeft: "auto", marginRight: "auto" }}>SIGN UP</span>
                <label>Username:</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => handleField(e, setUsername, usernameMaxLength)}
                />
                {/* <label>Email:</label>
                <input
                    type="text"
                    value={email}
                    onChange={(e) => handleField(e, setEmail, emailMaxLength)}
                /> */}
                <label>Password:</label>
                <input
                    type="text"
                    value={password}
                    onChange={(e) => handleField(e, setPassword, passwordMaxLength)}
                />
                {/* show this text only if username or password is blank */}
                {!(username && password) && <div style={{ color:"red" }} >Fill in all fields!</div>}
                <button disabled={!(username && password)} onClick={ handleSignUp }>Sign up</button>
                <span>
                    Already have an account?{" "}
                    <Link to="/Login">Login</Link>
                </span>
                {signedUp && <div style={{ color:"green" }}>Signed up successfully.  You can now login!</div>}
                {signUpDetails && <div style={{ color:"red" }}> {signUpDetails}</div>}
                {passwordWarning && <ul style={{ color:"red" }}>
                    <li>Password must contain at least a lowercase letter.</li>
                    <li>Password must contain at least an uppercase letter.</li>
                    <li>Password must contain at least a number.</li>
                    <li>Password must contain at least a special character: !, @.</li>
                </ul>}

            </div>

        </form>
    )
}

export default Signup