import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { AuthProvider } from './components/contexts/AuthContext'
import { StoreProvider } from './components/contexts/StoreContext'
import { LibraryProvider } from './components/contexts/LibraryContext'
import { HighscoreProvider } from './components/contexts/HighscoreContext'

createRoot(document.getElementById('root')).render(
    /*

    # --- AuthProvider --- #
    currentUser:
    -- NavbarMain.jsx: Display certain nav links if the user is logged in.
    -- AppRouter.jsx: Create route for Library component if user is logged in, restrict access otherwise.
    -- LibraryGameCard.jsx: Only for debug logs.
    -- StoreGameCard.jsx: Disable "+ Add to Library" button if logged out.
    -- Home.jsx: Welcome message.
    -- Login.jsx: Set user on successful login.
    -- Profile.jsx: Display current user.
    -- App.jsx: Fetch Library if user is logged.
    setCurrentUser:
    -- NavbarMain.jsx: "Quick Login" nav link in development mode.
    -- Profile.jsx: Remove current user on log out.
    -- App.jsx: Authenticate using token on app start.

    # --- StoreProvider --- #
    storeList:
    -- AppRouter.jsx: Create a route for each playable game in the list.
    -- Library.jsx: Get game info since LibraryList doesn't have game info attached.
    setStoreList:
    -- App.jsx: Set Store list fetched from server.

    # --- LibraryProvider --- #
    libraryList:
    -- Library.jsx: Get list of library games.
    setLibraryList:
    -- App.jsx: Set Library list fetched from server.
    librarySet:
    -- StoreGameCard.jsx: Disable "+ Add to Library" button if game already in Library.
    setLibrarySet:
    -- App.jsx: Set Library list fetched from server.
    handleAddToLibrary:
    -- StoreGameCard.jsx: Add game to Library.
    -- LibraryGameCard.jsx: Remove game from Library.

    # --- HighscoreProvider --- #
    setHighscoreHashMap:
    -- App.jsx to convert high score list to hash map after fetching the list from server.
    getHighScore:
    -- Store.jsx and Library.jsx to display high score on game cards.
    -- AppRouter.jsx to pass high score to GamePage component.
    getLastPlayed:
    -- Library.jsx to display last played on game cards.
    submitScore:
    -- AppRouter.jsx to pass submitScore handler to GamePage component.

    */

    // <StrictMode>
    <>
        <AuthProvider>
            <StoreProvider>
                <LibraryProvider>
                    <HighscoreProvider>
                        <App />
                    </HighscoreProvider>
                </LibraryProvider>
            </StoreProvider>
        </AuthProvider>
    </>
    // </StrictMode>
)
