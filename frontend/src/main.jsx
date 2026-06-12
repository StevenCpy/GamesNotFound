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
    -- StoreGameCard.jsx: Only for debug logs.
    -- Home.jsx: Welcome message.
    -- Login.jsx: Set user on successful login.
    -- Profile.jsx: Display current user.
    setCurrentUser:
    -- NavbarMain.jsx: "Quick Login" nav link in development mode.
    -- Profile.jsx: Remove current user on log out.

    # --- StoreProvider --- #
    storeList:
    -- AppRouter.jsx: Create a route for each playable game in the list.
    -- Library.jsx: Get game info since LibraryList doesn't have game info attached.

    # --- LibraryProvider --- #
    libraryList:
    -- LibraryGameCard.jsx: Remove from Library and create new Library list.
    -- StoreGameCard.jsx: Add to Library and create new Library list.
    -- Library.jsx: Get list of library games.
    setLibraryList:
    -- LibraryGameCard.jsx: Remove from Library and create new Library list.
    -- StoreGameCard.jsx: Add to Library and create new Library list.
    librarySet:
    -- LibraryGameCard.jsx: Remove from Library and create new Library set.
    -- StoreGameCard.jsx: Add to Library and create new Library set.
    setLibrarySet:
    -- LibraryGameCard.jsx: Remove from Library and create new Library set.
    -- StoreGameCard.jsx: Add to Library and create new Library set.

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
