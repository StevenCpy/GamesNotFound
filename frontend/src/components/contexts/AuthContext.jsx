import { createContext, useState } from "react"

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
        }
    }

    const quickLogin = (username) => setCurrentUser(username)

    return (
        <AuthContext value={{ currentUser, setCurrentUser, authenticateUsingToken, quickLogin }}>
            {children}
        </AuthContext>
    )
}