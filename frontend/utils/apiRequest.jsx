import SERVER_URL from "../src/data/serverVariables"
import devLog from "./logging/logging"

const STATUS_FAIL_MESSAGE = "Fail"
const API_VERSION = 2

async function apiRequest(component, endpoint, method, body, token) {
    devLog(component, `Calling ${endpoint} API endpoint...`)

    const URL = `${SERVER_URL}/api/v${API_VERSION}/${endpoint}`
    const request = { method: method }
    if (body || token) {
        const headers = {}
        if (body) {
            headers["Content-Type"] = "application/json"
            request.body = JSON.stringify(body)
        }
        // include JWT token in headers
        if (token) {
            headers["Authorization"] = `Bearer ${token}`
        }
        request.headers = headers
    }

    try {
        const response = await fetch(URL, request)
        const response_json = await response.json()
        return response_json
    } catch (error) {
        console.error(`Error calling ${endpoint} endpoint`, error)
        return {"status": STATUS_FAIL_MESSAGE, "details": `Error calling ${endpoint} endpoint`}
    }
}

export default apiRequest