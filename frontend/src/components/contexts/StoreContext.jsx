import { createContext, useState } from 'react'

// utils
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

    // sort function, ascending order relative to field
    function sortAscFn(a, b, field) {
        if (a[field] < b[field]) {
            return -1
        } else if (a[field] > b[field]) {
            return 1
        }
        return 0
    }

    // sort function, descending order relative to field
    function sortDescFn(a, b, field) {
        if (a[field] > b[field]) {
            return -1
        } else if (a[field] < b[field]) {
            return 1
        }
        return 0
    }

    function sortStoreList(fieldToSortBy, asc) {
        const storeListSorted = [...storeList] // copy list

        console.log("sortStoreList", fieldToSortBy, asc)

        if (asc) {
            console.log("asc")
            storeListSorted.sort((a,b) => sortAscFn(a,b,fieldToSortBy))
        } else {
            console.log("desc")
            storeListSorted.sort((a,b) => sortDescFn(a,b,fieldToSortBy))
        }
        setStoreList(storeListSorted)  
    }

    return (
        <StoreContext value={{ storeList, loadStore, sortStoreList }}>
            {children}
        </StoreContext>
    )
}