import { createContext, useState, useMemo, use } from 'react'
import { toast } from 'sonner'

// utils
import devLog from "../../utils/logging/logging"
import apiRequest from "../../utils/apiRequest"

const COMPONENT = "LibraryProvider"

type LibraryContextType = {
    libraryList: LibraryEntry[]
    librarySet: Set<number>
    loadLibrary: () => Promise<LoadLibraryResponse>
    clearLibrary: () => void
    handleAddToLibrary: (gameID: number) => Promise<void>
    handleRemoveFromLibrary: (gameID: number) => Promise<void>
}

export const LibraryContext = createContext<LibraryContextType|null>(null)

type LibraryEntry = {
    gameID: number
    added_at: string
}

type ApiRequestFail = {
    status: "Fail"
    details: string
}

type LoadLibraryResponseSuccess = {
    status: "Success"
    data: LibraryEntry[]
}

type LoadLibraryResponse = ApiRequestFail | LoadLibraryResponseSuccess

export function LibraryProvider( {children}: {children: React.ReactNode} ) {
    const [libraryList, setLibraryList] = useState<LibraryEntry[]>([]) // list for displaying library games in order

    // // convert libraryList to a set containing only gameIDs for quick lookups of library games
    const librarySet: Set<number> = useMemo(() =>
        // convert libraryList to a set containing only gameIDs
        new Set(libraryList.map(game => game.gameID)), [libraryList])

    async function loadLibrary() : Promise<LoadLibraryResponse> {
        devLog(COMPONENT, "loadLibrary() called")

        // send GET request to fetch Library from server
        const token = localStorage.getItem("token") // get JWT token from localStorage
        const response_json = await apiRequest(COMPONENT, "library/", "GET", null, token)

        if (response_json.status == "Success") {
            devLog(COMPONENT, "Library fetched")
            // initialize library games list
            setLibraryList(response_json.data)
        }
        return response_json
    }

    function clearLibrary() : void {
        devLog(COMPONENT, "clearLibrary() called")
        setLibraryList([])
    }

    // add gameID to library using pessimistic update
    async function handleAddToLibrary(gameID: number) : Promise<void> {
        devLog(COMPONENT, "handleAddToLibrary() called")

        // send POST request to server to add game to user's library
        const token = localStorage.getItem("token") // get JWT token from localStorage
        const response_json = await apiRequest(COMPONENT, `library/${gameID}`, "POST", null, token)

        // Optimistic update: update user's library on UI if server returns success
        if (response_json.status == "Success") {
            devLog(COMPONENT, `Server added game ID "${gameID}" user's library`)
            // get entry for new game in library
            // use server response to get server timestamp of when game was successfully added to library
            const libraryEntry = response_json.data
            devLog(COMPONENT, "new Library entry recorded")
            console.log(libraryEntry)

            // add the game to libraryList and librarySet
            setLibraryList([...libraryList, libraryEntry])
            // setLibrarySet(new Set(librarySet).add(gameID))

            toast("Game added to Library")
        }
    }

    // remove gameID from library using pessimistic update
    async function handleRemoveFromLibrary(gameID: number) : Promise<void> {
        devLog(COMPONENT, "handleRemoveFromLibrary() called")

        // // send DELETE request to server to remove game from user's library
        const token = localStorage.getItem("token") // get JWT token from localStorage
        const response_json = await apiRequest(COMPONENT, `library/${gameID}`, "DELETE", null, token)

        if (response_json.status == "Success") {
            devLog(COMPONENT, `Server removed game ID "${gameID}" from user's library`)

            // remove the game from libraryList and librarySet
            setLibraryList(libraryList.filter(game =>
                game.gameID != gameID)
            )
            // setLibrarySet(librarySet => {
            //     const newLibrarySet = new Set(librarySet)
            //     newLibrarySet.delete(gameID)
            //     return newLibrarySet
            // })

            toast("Game removed from Library")
        }
    }

    return (
        <LibraryContext value={{ libraryList, librarySet, loadLibrary, clearLibrary, handleAddToLibrary, handleRemoveFromLibrary }}>
            {children}
        </LibraryContext>
    )
}

export function useLibrary() {
    const libraryContext = use(LibraryContext)

    if (!libraryContext) {
        throw new Error("LibraryContext is null")
    }

    return libraryContext
}