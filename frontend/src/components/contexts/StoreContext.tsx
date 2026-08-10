import { createContext, useState, use, useCallback } from 'react'

// utils
import devLog from "../../utils/logging/logging"
import { apiRequest } from "../../utils/apiRequest"

// api response types
import { type StoreEntry, type LoadStoreResponse, type LeaderboardResponse } from '../ApiResponseTypes/StoreResponseTypes'

const COMPONENT = "StoreContext"

type StoreContextType = {
    storeList: StoreEntry[]
    loadStore: () => Promise<LoadStoreResponse>
    sortStoreList: (fieldToSortBy: FieldType, asc: boolean) => void
    getLeaderboard: (gameID: number) => Promise<LeaderboardResponse>
}

export const StoreContext = createContext<StoreContextType|null>(null)

type FieldType = "gameID" | "name"

export function StoreProvider( {children}: {children: React.ReactNode} ) {
    const [storeList, setStoreList] = useState<StoreEntry[]>([]) // list for displaying store games

    const loadStore = useCallback(async () : Promise<LoadStoreResponse> => {
        devLog(COMPONENT, "loadStore() called")

        const response_json: LoadStoreResponse = await apiRequest(COMPONENT, "store/", "GET") // send GET request to fetch Store from server
        if (response_json.status == "Success") {
            devLog(COMPONENT, "Store fetched")
            // initialize store games list
            setStoreList(response_json.data)
        }
        return response_json
    }, [])

    // sort function, ascending order relative to field
    const sortAscFn = useCallback((a: StoreEntry, b: StoreEntry, field: FieldType) : number => {
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
    }, [storeList])

    // sort function, descending order relative to field
    const sortDescFn = useCallback((a: StoreEntry, b: StoreEntry, field: FieldType) : number => {
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
    }, [storeList])

    const sortStoreList = useCallback((fieldToSortBy: FieldType, asc: boolean) : void => {
        const storeListSorted = [...storeList] // copy list

        if (asc) {
            storeListSorted.sort((a,b) => sortAscFn(a,b,fieldToSortBy))
        } else {
            storeListSorted.sort((a,b) => sortDescFn(a,b,fieldToSortBy))
        }
        setStoreList(storeListSorted)  
    }, [storeList])

    const getLeaderboard = useCallback(async (gameID: number) : Promise<LeaderboardResponse> => {
        devLog(COMPONENT, "loadStore() called")

        const response_json: LeaderboardResponse = await apiRequest(COMPONENT, `leaderboard/${gameID}`, "GET") // send GET request to fetch leaderboard from server for gameID
        if (response_json.status == "Success") {
            devLog(COMPONENT, `Leaderboard fetched for game ${gameID}`)
        }
        return response_json
    }, [])


    return (
        <StoreContext value={{ storeList, loadStore, sortStoreList, getLeaderboard }}>
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