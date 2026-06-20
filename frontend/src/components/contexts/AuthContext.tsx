import { createContext, useState, use } from 'react'
import { toast } from 'sonner'

// utils
import devLog from "../../utils/logging/logging"
import apiRequest from "../../utils/apiRequest"

const COMPONENT = "AuthContext"

type AuthContextType = {
    currentUser: UserInfo | null
    setCurrentUser: React.Dispatch<React.SetStateAction<UserInfo | null>>
    signupServer: (username: string, password: string) => Promise<SignupResponse>
    authenticateUsingToken: () => Promise<void>
    quickLogin: () => void
    loginServer: (username: string, password: string) => Promise<LoginResponse>
}

export const AuthContext = createContext<AuthContextType|null>(null)

type UserInfo = {
    username: string
    profile_pic_url: string | null
    created_at: string
}

type ApiResponseFail = {
    status: "Fail"
    details: string
}

type LoginResponseSuccess = {
    status: "Success"
    userInfo: UserInfo
}

type LoginResponse = ApiResponseFail | LoginResponseSuccess

type SignupResponseSuccess = {
    status: "Success"
}

type SignupResponse = ApiResponseFail | SignupResponseSuccess

export function AuthProvider( {children}: {children: React.ReactNode} ) {
    const [currentUser, setCurrentUser] = useState<UserInfo|null>(null)

    async function authenticateUsingToken() : Promise<void> {
        // send GET request to fetch username from server
        const token = localStorage.getItem("token") // get JWT token from localStorage
        const auth_response_json = await apiRequest(COMPONENT, "auth/me", "GET", null, token)
        if (auth_response_json.status == "Success") {
            setCurrentUser(auth_response_json.user_info)
            
            toast(`Logged in as ${auth_response_json.user_info["username"]}`)
        }
    }

    const quickLogin = () => setCurrentUser({"username": "Admin",
                                                "profile_pic_url": null,
                                                "created_at": "2026-06-08 02:24:10.281809+00"})

    async function loginServer(username: string, password: string) : Promise<LoginResponse> {
        // send login POST request to server to handle login
        const response_json = await apiRequest(COMPONENT, "auth/login", "POST", { username: username, password: password })
        if (response_json.status == "Success") {
            devLog(COMPONENT, `User "${username.toUpperCase()}" successfully logged in by server`)
            // store JWT token received from server
            localStorage.setItem("token", response_json.token)
            setCurrentUser(response_json.user_info)

            toast(`Successfully logged in.  Welcome back ${username.toUpperCase()}!`)
        } else {
            devLog(COMPONENT, `Login failed.  Server error details - ${response_json.details}`)
        }
        return response_json
    }

    async function signupServer(username: string, password: string) : Promise<SignupResponse> {
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

export function useAuth() {
    const authContext = use(AuthContext)

    if (!authContext) {
        throw new Error("AuthContext is null")
    }

    return authContext
}