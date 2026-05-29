import { createContext, useState } from "react"

export const AuthContext = createContext(null)

export function AuthProvider( {children} ) {
    const [currentUser, setCurrentUser] = useState(null)

    return (
        <AuthContext value={{ currentUser, setCurrentUser }}>
            {children}
        </AuthContext>
    )
}