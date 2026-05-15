import { useContext } from "react"
import { AuthContext } from "../components/Context"

function Library() {
    const { library, setLibrary } = useContext(AuthContext)

    function loadLibraryServer() {
        try {
            const response = await fetch(`${SERVER_URL}/loadLibrary`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: currentUser
                })
            })
            const data = await response.json()
            return data
        } catch (error) {
            console.error("Error calling loadLibrary API", error)
            return {"status": "Fail", "details": "Error calling loadLibrary API"}
        }
    }

    return (
        <div>
            This is the library
        </div>
    )
}