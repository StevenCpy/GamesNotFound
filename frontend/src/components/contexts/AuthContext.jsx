import { createContext, useState } from 'react'
import { toast } from 'sonner'

// utils
import devLog from "../../../utils/logging/logging"
import apiRequest from "../../../utils/apiRequest"

const COMPONENT = "AuthContext"

export const AuthContext = createContext(null)

export function AuthProvider( {children} ) {
    const [currentUser, setCurrentUser] = useState(null)

    async function authenticateUsingToken() {
        // send GET request to fetch username from server
        const token = localStorage.getItem("token") // get JWT token from localStorage
        const auth_response_json = await apiRequest(COMPONENT, "auth/me", "GET", null, token)
        if (auth_response_json.status == "Success") {
            setCurrentUser(auth_response_json.username)

            toast(`Logged in as ${auth_response_json.username}`)
        }
    }

    const quickLogin = (username) => setCurrentUser(username)

    async function loginServer(username, password) {
        // send login POST request to server to handle login
        const response_json = await apiRequest(COMPONENT, "auth/login", "POST", { username: username, password: password })
        if (response_json.status == "Success") {
            devLog(COMPONENT, `User "${username.toUpperCase()}" successfully logged in by server`)
            // store JWT token received from server
            localStorage.setItem("token", response_json.token)
            setCurrentUser(username.toUpperCase())

            toast(`Successfully logged in.  Welcome back ${username.toUpperCase()}!`)
        } else {
            devLog(COMPONENT, `Login failed.  Server error details - ${response_json.details}`)
        }
        return response_json
    }

    async function signupServer(username, password) {
        // send sign up POST request to server to handle sign up
        const response_json = await apiRequest(COMPONENT, "auth/signup", "POST", { username: username, password: password })
        if (response_json.status == "Success") {
            devLog(COMPONENT, `User ${username} successfully signed up by server`)
        } else {
            devLog(COMPONENT, `Sign up failed.  Server error details - ${response_json.details}`)
        }
        return response_json
    }

    return (
        <AuthContext value={{ currentUser, setCurrentUser, signupServer, authenticateUsingToken, quickLogin, loginServer }}>
            {children}
        </AuthContext>
    )
}