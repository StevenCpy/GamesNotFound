import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import './styling/Auth.css'

// contexts
import { AuthContext } from '../components/contexts/AuthContext'

// utils
import devLog from "../../utils/logging/logging"

const COMPONENT = "Signup"

function Signup() {
    devLog(COMPONENT, "Signup() called")
    const [username, setUsername] = useState("")
    //const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [signedUp, setSignedUp] = useState(false)
    const [warning, setWarning] = useState(null)
    const { signupServer } = useContext(AuthContext)
    
    const USERNAME_MAX_LENGTH = 10
    //const EMAIL_MAX_LENGTH = 320
    const PASSWORD_MAX_LENGTH = 128
    const INVALID_PASSWORD_WARNING = "Invalid password"

    // check if password follows rules
    function passwordIsValid(password) {
        devLog(COMPONENT, "passwordIsValid() called")
        const lowercaseRe = /[a-z]+/
        const uppercaseRe = /[A-Z]+/
        const digitRe = /\d+/
        const specialCharRe = /[!@#$%^&*()]+/

        return (lowercaseRe.test(password) && uppercaseRe.test(password) && digitRe.test(password) && specialCharRe.test(password))
    }

    function WarningMessage({ message }) {
        return (
            (message == INVALID_PASSWORD_WARNING) ?
                <ul className="text-fail"> Password must contain at least
                    <li>a lowercase letter.</li>
                    <li>an uppercase letter.</li>
                    <li>a number.</li>
                    <li>a special character: !, @.</li>
                </ul>
                : <p className="text-fail">{message}</p>   
        )
    }

    async function handleSignUp(e) {
        devLog(COMPONENT, "handleSignUp() called")

        // TODO -- add email validation, email must follow regex (removed email requirement when signing up)
        // TODO -- add password validation, password must follow regex
        e.preventDefault() // prevent re-rendering whole App() on submit/pressing "Sign Up" button
        if (passwordIsValid(password)) {
            devLog(COMPONENT, "Valid password.  Initiating server-side sign up...")

            const response_json = await signupServer(username, password)
            if (response_json.status == "Success") {
                setSignedUp(true)
                setWarning(null)
            } else {
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
                maxLength={USERNAME_MAX_LENGTH}
                onChange={(e) => setUsername(e.target.value)}
            />
            {/* <label>Email:</label>
            <input
                type="text"
                value={email}
                maxLength={EMAIL_MAX_LENGTH}
                onChange={(e) => setEmail(e.target.value)}
            /> */}
            <label>Password:</label>
            <input
                type="password"
                value={password}
                maxLength={PASSWORD_MAX_LENGTH}
                onChange={(e) => setPassword(e.target.value)}
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