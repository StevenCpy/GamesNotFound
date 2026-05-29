import { createContext, useState } from "react"

export const LibraryContext = createContext(null)

export function LibraryProvider( {children} ) {
    const [libraryList, setLibraryList] = useState([]) // list for displaying library games in order
    const [librarySet, setLibrarySet] = useState(new Set()) // set for quick lookups of library games

    return (
        <LibraryContext value={{ libraryList, setLibraryList, librarySet, setLibrarySet }}>
            {children}
        </LibraryContext>
    )
}