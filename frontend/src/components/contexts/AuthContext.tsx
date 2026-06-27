import { createContext, useState, use } from 'react'
import { toast } from 'sonner'

// utils
import devLog from "../../utils/logging/logging"
import { apiRequest } from "../../utils/apiRequest"

// api response types
import { type UserInfo, type AuthResponse, type SignupResponse, type LoginResponse, type QuickSignupResponse, type LogoutResponse } from '../ApiResponseTypes/AuthResponseTypes'

const COMPONENT = "AuthContext"

type AuthContextType = {
    currentUser: UserInfo | null
    setCurrentUser: React.Dispatch<React.SetStateAction<UserInfo | null>>
    authenticateUsingToken: () => Promise<void>
    signupServer: (username: string, password: string) => Promise<SignupResponse>
    loginServer: (username: string, password: string) => Promise<LoginResponse>
    devLogin: () => void
    quickSignup: () => Promise<void>
    logoutServer: () => Promise<LogoutResponse>
}

export const AuthContext = createContext<AuthContextType|null>(null)

export function AuthProvider( {children}: {children: React.ReactNode} ) {
    const [currentUser, setCurrentUser] = useState<UserInfo|null>(null)

    async function authenticateUsingToken() : Promise<void> {
        // send GET request to fetch username from server
        const response_json: AuthResponse = await apiRequest(COMPONENT, "auth/me", "GET")
        if (response_json.status == "Success") {
            setCurrentUser(response_json.data.user_info)
            
            toast(`Logged in as ${response_json.data.user_info["username"]}`)
        }
    }

    async function signupServer(username: string, password: string) : Promise<SignupResponse> {
        const body = {
            username: username,
            password: password
        }
        // send sign up POST request to server to handle sign up
        const response_json: SignupResponse = await apiRequest(COMPONENT, "auth/signup", "POST", body)
        if (response_json.status == "Success") {
            devLog(COMPONENT, `User ${username} successfully signed up by server`)
        } else {
            devLog(COMPONENT, `Sign up failed.  Server error details - ${response_json.details}`)
        }
        return response_json
    }

    async function loginServer(username: string, password: string) : Promise<LoginResponse> {
        const body = {
            username: username,
            password: password
        }
        // send login POST request to server to handle login
        const response_json : LoginResponse = await apiRequest(COMPONENT, "auth/login", "POST", body)
        if (response_json.status == "Success") {
            devLog(COMPONENT, `User "${username.toLowerCase()}" successfully logged in by server`)
            setCurrentUser(response_json.data.user_info)

            toast(`Successfully logged in.  Welcome back ${username.toLowerCase()}!`)
        } else {
            devLog(COMPONENT, `Login failed.  Server error details - ${response_json.details}`)
        }
        return response_json
    }

    const devLogin = () => setCurrentUser({"username": "admin",
                                            "profile_pic_url": null,
                                            "created_at": "2026-06-08 02:24:10.281809+00",
                                            "temp": false})

    async function quickSignup() : Promise<void> {
        // send login POST request to server to handle quick signup
        const response_json: QuickSignupResponse = await apiRequest(COMPONENT, "auth/quick-signup", "POST")
        if (response_json.status == "Success") {
            const randomUsername = response_json.data.user_info["username"]
            devLog(COMPONENT, `User "${randomUsername}" successfully logged in by server`)
            setCurrentUser(response_json.data.user_info)

            toast(`Successfully logged in.  Welcome back ${randomUsername}!`)
        } else {
            devLog(COMPONENT, `Login failed.  Server error details - ${response_json.details}`)
        }
    }

    async function logoutServer(): Promise<LogoutResponse> {
        const response_json: LogoutResponse = await apiRequest(COMPONENT, "auth/logout", "POST")
        if (response_json.status == "Success") {
            setCurrentUser(null)
            toast(`Successfully logged out!`)
        }

        return response_json
    }

    return (
        <AuthContext value={{ currentUser, setCurrentUser, authenticateUsingToken, signupServer, loginServer, devLogin, quickSignup, logoutServer }}>
            {children}
        </AuthContext>
    )
}

export function useAuth() {
    const authContext = use(AuthContext)

    if (!authContext) {
        throw new Error("AuthContext is null")
    }

    return authContext
}