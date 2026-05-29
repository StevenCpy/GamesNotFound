import SERVER_URL from "../src/data/serverVariables"
import devLog from "./logging/logging"

const STATUS_FAIL_MESSAGE = "Fail"

async function apiRequest(component, endpoint, method, body) {
    devLog(component, `Calling ${endpoint} API endpoint...`)

    const URL = `${SERVER_URL}/${endpoint}`
    const request = { method: method }
    if (body) {
        request.headers = { "Content-Type": "application/json" }
        request.body = JSON.stringify(body)
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