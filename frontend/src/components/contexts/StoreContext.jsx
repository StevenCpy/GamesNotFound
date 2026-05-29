import { createContext, useState } from "react"

export const StoreContext = createContext(null)

export function StoreProvider( {children} ) {
    const [storeList, setStoreList] = useState([]) // list for displaying store games

    return (
        <StoreContext value={{ storeList, setStoreList }}>
            {children}
        </StoreContext>
    )
}