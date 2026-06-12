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
    -- StoreGameCard.jsx: Disable "+ Add to Library" button if logged out.
    -- Home.jsx: Welcome message.
    -- Login.jsx: Set user on successful login.
    -- Profile.jsx: Display current user.
    -- App.jsx: Fetch Library if user is logged.
    setCurrentUser:
    -- NavbarMain.jsx: "Quick Login" nav link in development mode.
    -- Profile.jsx: Remove current user on log out.
    authenticateUsingToken:
    -- App.jsx to authenticate using JWT token on app start.

    # --- StoreProvider --- #
    storeList:
    -- AppRouter.jsx: Create a route for each playable game in the list.
    -- Library.jsx: Get game info since LibraryList doesn't have game info attached.
    loadStore:
    -- App.jsx: Load Store games.

    # --- LibraryProvider --- #
    libraryList:
    -- Library.jsx: Iterate through Library games to display game cards.
    librarySet:
    -- StoreGameCard.jsx: Disable "+ Add to Library" button if game already in Library.
    loadLibrary:
    -- App.jsx: Load Library games.
    handleAddToLibrary:
    -- StoreGameCard.jsx: Add game to Library.
    handleRemoveLibrary:
    -- LibraryGameCard.jsx: Remove game from Library.

    # --- HighscoreProvider --- #
    loadHighScores:
    -- App.jsx: Fetch high score list from server.
    clearHighScores:
    -- App.jsx: Clear score list.
    getHighScore:
    -- Store.jsx: Display high score on game cards.
    -- Library.jsx: Display high score on game cards.
    -- AppRouter.jsx: Pass high score to GamePage component.
    getLastPlayed:
    -- Library.jsx: Display last played on game cards.
    submitScore:
    -- AppRouter.jsx: Pass submitScore handler to GamePage component.

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
