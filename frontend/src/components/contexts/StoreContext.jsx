import { createContext, useState } from "react"

import devLog from "../../../utils/logging/logging"
import apiRequest from "../../../utils/apiRequest"

const COMPONENT = "StoreContext"

export const StoreContext = createContext(null)

export function StoreProvider( {children} ) {
    const [storeList, setStoreList] = useState([]) // list for displaying store games

    async function loadStore() {
        devLog(COMPONENT, "loadStore() called")
        const response_json = await apiRequest(COMPONENT, "store/", "GET") // send GET request to fetch Store from server

        if (response_json.status == "Success") {
            devLog(COMPONENT, "Store fetched")
            // initialize store games list
            setStoreList(response_json.data)
        }
        return response_json
    }

    return (
        <StoreContext value={{ storeList, loadStore }}>
            {children}
        </StoreContext>
    )
}