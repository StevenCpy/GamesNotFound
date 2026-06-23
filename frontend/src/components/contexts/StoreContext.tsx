import { createContext, useState, use } from 'react'

// utils
import devLog from "../../utils/logging/logging"
import apiRequest from "../../utils/apiRequest"

const COMPONENT = "StoreContext"

type StoreContextType = {
    storeList: StoreEntry[]
    loadStore: () => Promise<LoadStoreResponse>
    sortStoreList: (fieldToSortBy: fieldType, asc: boolean) => void
}

export const StoreContext = createContext<StoreContextType|null>(null)

type ApiRequestFail = {
    status: "Fail"
    details: string
}

type StoreEntry = {
    gameID: number
    name: string
    cover_image_url: string
    description: string
    author: string
    version: string
    is_playable: boolean
    library_adds: number
    uploaded_on: string | null
}

type LoadStoreResponseSuccess = {
    status: "Success"
    data: StoreEntry[]
}

type LoadStoreResponse = ApiRequestFail | LoadStoreResponseSuccess

type fieldType = "gameID" | "name"

export function StoreProvider( {children}: {children: React.ReactNode} ) {
    const [storeList, setStoreList] = useState<StoreEntry[]>([]) // list for displaying store games

    async function loadStore() : Promise<LoadStoreResponse> {
        devLog(COMPONENT, "loadStore() called")

        const response_json: LoadStoreResponse = await apiRequest(COMPONENT, "store/", "GET") // send GET request to fetch Store from server
        if (response_json.status == "Success") {
            devLog(COMPONENT, "Store fetched")
            // initialize store games list
            setStoreList(response_json.data)
        }
        return response_json
    }

    // sort function, ascending order relative to field
    function sortAscFn(a: StoreEntry, b: StoreEntry, field: fieldType) : number {
        if (typeof storeList[0][field] === "string") {
            return (a[field] as string).localeCompare(b[field] as string)
        } else {
            if (a[field] < b[field]) {
                return -1
            } else if (a[field] > b[field]) {
                return 1
            }
            return 0
        }
    }

    // sort function, descending order relative to field
    function sortDescFn(a: StoreEntry, b: StoreEntry, field: fieldType) : number {
        if (typeof storeList[0][field] === "string") {
            return (b[field] as string).localeCompare(a[field] as string)
        } else {
            if (a[field] > b[field]) {
                return -1
            } else if (a[field] < b[field]) {
                return 1
            }
            return 0
        } 
    }

    function sortStoreList(fieldToSortBy: fieldType, asc: boolean) : void {
        const storeListSorted = [...storeList] // copy list

        if (asc) {
            storeListSorted.sort((a,b) => sortAscFn(a,b,fieldToSortBy))
        } else {
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

export function useStore() {
    const storeContext = use(StoreContext)

    if (!storeContext) {
        throw new Error("StoreContext is null")
    }

    return storeContext
}