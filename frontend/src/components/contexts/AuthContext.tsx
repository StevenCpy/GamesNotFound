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

type ApiResponseFail = {
    status: "Fail"
    details: string
}

type UserInfo = {
    username: string
    profile_pic_url: string | null
    created_at: string
}

type AuthResponseSuccess = {
    status: "Success"
    data: {user_info: UserInfo}
}

type AuthResponse = ApiResponseFail | AuthResponseSuccess

type LoginResponseSuccess = {
    status: "Success"
    data: {user_info: UserInfo}
}

type LoginResponse = ApiResponseFail | LoginResponseSuccess

type SignupResponseSuccess = {
    status: "Success"
    data: null
}

type SignupResponse = ApiResponseFail | SignupResponseSuccess

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

    const quickLogin = () => setCurrentUser({"username": "Admin",
                                                "profile_pic_url": null,
                                                "created_at": "2026-06-08 02:24:10.281809+00"})

    async function loginServer(username: string, password: string) : Promise<LoginResponse> {
        const body = {
            username: username,
            password: password
        }
        // send login POST request to server to handle login
        const response_json : LoginResponse = await apiRequest(COMPONENT, "auth/login", "POST", body)
        if (response_json.status == "Success") {
            devLog(COMPONENT, `User "${username.toUpperCase()}" successfully logged in by server`)
            setCurrentUser(response_json.data.user_info)

            toast(`Successfully logged in.  Welcome back ${username.toUpperCase()}!`)
        } else {
            devLog(COMPONENT, `Login failed.  Server error details - ${response_json.details}`)
        }
        return response_json
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