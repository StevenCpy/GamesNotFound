import { useState } from 'react'
import { Link } from 'react-router-dom'
import './styling/Auth.css'

// contexts
import { useAuth } from '../components/contexts/AuthContext'

// components
import PasswordInputWithToggle from "../components/forms/PasswordInputWithToggle"

// utils
import devLog from "../utils/logging/logging"

const COMPONENT = "Signup"

function Signup() {
    devLog(COMPONENT, "Signup() called")
    const { signupServer } = useAuth()

    const [username, setUsername] = useState("")
    //const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [signedUp, setSignedUp] = useState(false)
    const [warning, setWarning] = useState<string|null>(null)

    const USERNAME_MAX_LENGTH = 10
    //const EMAIL_MAX_LENGTH = 320
    const PASSWORD_MAX_LENGTH = 128
    const INVALID_PASSWORD_WARNING = "Invalid password"

    // check if password follows rules
    function passwordIsValid(password: string) : boolean {
        devLog(COMPONENT, "passwordIsValid() called")
        const lowercaseRe = /[a-z]+/
        const uppercaseRe = /[A-Z]+/
        const digitRe = /\d+/
        const specialCharRe = /[!@#$%^&*()]+/

        return (lowercaseRe.test(password) && uppercaseRe.test(password) && digitRe.test(password) && specialCharRe.test(password))
    }

    function WarningMessage( {message}: {message: string|null} ) {
        return (
            (message == INVALID_PASSWORD_WARNING) ?
                <ul className="text-red"> Password must contain at least
                    <li>a lowercase letter.</li>
                    <li>an uppercase letter.</li>
                    <li>a number.</li>
                    <li>a special character: !, @.</li>
                </ul>
                : <p className="text-red">{message}</p>
        )
    }

    async function handleSignUp(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> {
        devLog(COMPONENT, "handleSignUp() called")

        // TODO -- add email validation, email must follow regex (removed email requirement when signing up)
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
            <p className="text-green">Passwords are encrypted so even I cannot see them in the database!</p>
            <h3 className="header-title">SIGN UP</h3>

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
            <PasswordInputWithToggle
                password={password}
                maxLength={PASSWORD_MAX_LENGTH}
                setPassword={setPassword}
            />
            {/* show this text only if username or password is blank */}
            {!(username && password) && <p className="text-red">Fill in all fields!</p>}
            <button disabled={!(username && password)} onClick={ handleSignUp }>Sign up</button>
            <div>
                Already have an account?{" "}
                <Link to="/login">Login</Link>
            </div>
            {signedUp ?
                <p className="text-green">Signed up successfully.  You can now login!</p>
                : <WarningMessage message={warning} />
            }
        </form>
    )
}

export default Signup