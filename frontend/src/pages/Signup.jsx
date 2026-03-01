import { useState } from 'react'
import { Link } from 'react-router-dom'

function Signup() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [signedUp, setSignedUp] = useState(false)
    const [passwordWarning, setPasswordWarning] = useState(false)
    
    const usernameMaxLength = 30
    const emailMaxLength = 320
    const passwordMaxLength = 128

    function handleField(e, setField, fieldMaxLength) {
        if (e.target.value.length < fieldMaxLength) {
            setField(e.target.value)
        }
    }

    function handleSignUp(e) {
        // TODO -- add backend logic for checking if email and username are available
        // TODO -- add email validation, email must follow regex (removed email requirement when signing up)
        // TODO -- add password validation, password must follow regex
        e.preventDefault()
        setSignedUp(false)
        setPasswordWarning(false)
        if (passwordIsValid(password)) {
            console.log("valid")
            setSignedUp(true)
        } else {
            console.log("invalid")
            setPasswordWarning(true)
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
        console.log(hasLowercase, hasUppercase, hasNumber, hasSpecial)
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