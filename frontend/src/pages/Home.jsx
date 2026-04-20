import { useState } from 'react'

function Home() {
    const [response, setResponse] = useState("")

    const handleAPI = async() => {
        try {
            const res = await fetch("http://127.0.0.1:8000/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: "User1",
                    password: "Password1"
                })
            })
            const data = await res.json()
            setResponse(`User successfully signed up with Username: ${data.username}, Password: ${data.password}`)
        } catch (error) {
            console.error("API failure", error)
        }
    }

    return (
        <div style={{ padding: "50px" }}>
            <button onClick={handleAPI}>
                LET'S TEST THE API, SHALL WE?
            </button>
            
            <p>Response: {response}</p>
        </div>
    )
}

export default Home