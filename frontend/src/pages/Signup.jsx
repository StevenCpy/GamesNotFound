import { useState } from 'react'
import { Link } from 'react-router-dom'
import SERVER_URL from '../data/server_variables'
import devLog from "../../test/logging"

const COMPONENT = "Signup"

function Signup() {
    devLog(COMPONENT, "Signup() called")
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

    // send sign up POST request to server
    async function handleSignUpServer() {
        devLog(COMPONENT, "handleSignUpServer() called")
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
            const response_json = await response.json()
            return response_json
        } catch (error) {
            console.error("Error calling signup API", error)
            return {"status": "Fail", "details": "Error calling signup API"}
        }
    }

    async function handleSignUp(e) {
        devLog(COMPONENT, "handleSignUp() called")

        // TODO -- add email validation, email must follow regex (removed email requirement when signing up)
        // TODO -- add password validation, password must follow regex
        e.preventDefault() // prevent re-rendering whole App() on submit/pressing "Sign Up" button
        if (passwordIsValid(password)) {
            devLog(COMPONENT, "Valid password.  Initiating server-side sign up...")

            // send request to server to handle sign up
            const response_json = await handleSignUpServer()
            if (response_json.status == "Success") {
                devLog(COMPONENT, `User ${username} successfully signed up by server`)
                setSignedUp(true)
                setSignUpDetails("")
                setPasswordWarning(false)
            } else {
                devLog(COMPONENT, `Sign up failed.  Server error details - ${response_json.details}`)
                setSignUpDetails(response_json.details)
                setSignedUp(false)
                setPasswordWarning(false)
            }
        } else {
            devLog(COMPONENT, "Invalid password")
            setPasswordWarning(true)
            setSignedUp(false)
            setSignUpDetails("")
        }
    }

    // check if password follows rules
    function passwordIsValid(password) {
        devLog(COMPONENT, "passwordIsValid() called")
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