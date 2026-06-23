import SERVER_URL from "../data/serverVariables"
import devLog from "./logging/logging"

const STATUS_FAIL_MESSAGE = "Fail"
const API_VERSION = "v3"

type ApiRequest = {
    method: string
    credentials: "include"
    headers?:{"content-type": "application/json"}
    body?: string
}

export type ApiResponseFail = {
    status: "Fail"
    details: string
}

export type BaseApiResponseSuccess<T> = {
    status: "Success"
    data: T
    message?: string
}

export async function apiRequest(component: string, endpoint: string, method: string, body?: any) {
    devLog(component, `Calling ${endpoint} API endpoint...`)

    const REQUEST_URL = `${SERVER_URL}/api/${API_VERSION}/${endpoint}`
    const request: ApiRequest = {
        method: method,
        credentials: "include"
    }
    if (body) {
        request.headers = {"content-type": "application/json"}
        request.body = JSON.stringify(body)
    }

    try {
        const response = await fetch(REQUEST_URL, request)
        const response_json = await response.json()
        return response_json
    } catch (error) {
        console.error(`Error calling ${endpoint} endpoint`, error)
        return {"status": STATUS_FAIL_MESSAGE, "details": `Error calling ${endpoint} endpoint`}
    }
}