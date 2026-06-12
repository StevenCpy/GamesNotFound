import { createContext, useState, useEffect, useMemo } from "react"

import devLog from "../../../utils/logging/logging"
import apiRequest from "../../../utils/apiRequest"

const COMPONENT = "LibraryProvider"

export const LibraryContext = createContext(null)

export function LibraryProvider( {children} ) {
    const [libraryList, setLibraryList] = useState([]) // list for displaying library games in order

    // // convert libraryList to a set containing only gameIDs for quick lookups of library games
    const librarySet = useMemo(() =>
        // convert libraryList to a set containing only gameIDs
        new Set(libraryList.map(game => game.gameID)), [libraryList])

    async function loadLibrary() {
        devLog(COMPONENT, "loadLibrary() called")

        // send GET request to fetch Library from server
        const token = localStorage.getItem("token") // get JWT token from localStorage
        const library_response_json = await apiRequest(COMPONENT, "library/", "GET", null, token)

        if (library_response_json.status == "Success") {
            devLog(COMPONENT, "Library fetched")
            // initialize library games list
            setLibraryList(library_response_json.data)
        }
        console.log(library_response_json)
        return library_response_json.status
    }

    function clearLibrary() {
        devLog(COMPONENT, "clearLibrary() called")
        setLibraryList([])
    }

    // add gameID to library using optimistic update
    async function handleAddToLibrary(gameID) {
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
        }
    }

    // remove gameID from library using optimistic update
    async function handleRemoveFromLibrary(gameID) {
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
        }
    }

    return (
        <LibraryContext value={{ libraryList, librarySet, loadLibrary, clearLibrary, handleAddToLibrary, handleRemoveFromLibrary }}>
            {children}
        </LibraryContext>
    )
}