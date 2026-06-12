import { useState } from 'react'
import { Link } from 'react-router-dom'

import './styling/Auth.css'

import devLog from "../../utils/logging/logging"
import apiRequest from '../../utils/apiRequest'

const COMPONENT = "Signup"

function Signup() {
    devLog(COMPONENT, "Signup() called")
    const [username, setUsername] = useState("")
    //const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [signedUp, setSignedUp] = useState(false)
    const [warning, setWarning] = useState(null)
    
    const usernameMaxLength = 30
    //const emailMaxLength = 320
    const passwordMaxLength = 128
    const INVALID_PASSWORD_WARNING = "Invalid password"

    function handleField(e, setField, fieldMaxLength) {
        if (e.target.value.length < fieldMaxLength) {
            setField(e.target.value)
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

    function WarningMessage({ message }) {
        return (
            <p className="text-fail"> {
                (message == INVALID_PASSWORD_WARNING) ?
                    (<ul className="text-fail"> Password must contain at least
                        <li>a lowercase letter.</li>
                        <li>an uppercase letter.</li>
                        <li>a number.</li>
                        <li>a special character: !, @.</li>
                    </ul>)
                    : message
            }
            </p>      
        )
    }

    async function handleSignUp(e) {
        devLog(COMPONENT, "handleSignUp() called")

        // TODO -- add email validation, email must follow regex (removed email requirement when signing up)
        // TODO -- add password validation, password must follow regex
        e.preventDefault() // prevent re-rendering whole App() on submit/pressing "Sign Up" button
        if (passwordIsValid(password)) {
            devLog(COMPONENT, "Valid password.  Initiating server-side sign up...")

            // send sign up POST request to server to handle sign up
            const response_json = await apiRequest(COMPONENT, "auth/signup", "POST", { username: username, password: password })
            console.log(response_json)
            if (response_json.status == "Success") {
                devLog(COMPONENT, `User ${username} successfully signed up by server`)
                setSignedUp(true)
                setWarning(null)
            } else {
                devLog(COMPONENT, `Sign up failed.  Server error details - ${response_json.details}`)
                setSignedUp(false)
                setWarning(response_json.details)
            }
        } else {
            devLog(COMPONENT, "Invalid password")
            setSignedUp(false)
            setWarning(INVALID_PASSWORD_WARNING)
        }
    }

    return (
        <form id="auth-form">
            <p>
                WARNING:<br />
                Passwords not currently encrypted so I can see them in the database.  Please consider this.<br />
                I will remove this warning after I implement password hashing.
            </p>

            <h3>SIGN UP</h3>

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
            {!(username && password) && <p className="text-fail">Fill in all fields!</p>}
            <button disabled={!(username && password)} onClick={ handleSignUp }>Sign up</button>
            <span>
                Already have an account?{" "}
                <Link to="/login">Login</Link>
            </span>
            { signedUp ?
                <p className="text-success">Signed up successfully.  You can now login!</p>
                : <WarningMessage message={warning} />
            }
        </form>
    )
}

export default Signup