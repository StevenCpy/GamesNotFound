import { useContext } from "react"
import { AuthContext } from "../components/Context"
import SERVER_URL from "../data/server_variables"

function Library() {
    const { library, setLibrary } = useContext(AuthContext)

    async function loadLibraryServer() {
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

export default Library