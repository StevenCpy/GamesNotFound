// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// components
import App from './App.jsx'

// providers
import { AuthProvider } from './components/contexts/AuthContext.jsx'
import { StoreProvider } from './components/contexts/StoreContext.jsx'
import { LibraryProvider } from './components/contexts/LibraryContext.jsx'
import { HighscoreProvider } from './components/contexts/HighscoreContext.jsx'
import { LoadingProvider } from './components/contexts/LoadingContext.jsx'

createRoot(document.getElementById('root') as HTMLElement).render(
    /*

    # --- AuthProvider --- #
    currentUser:
    -- NavbarMain.jsx: Display certain nav links if the user is logged in.
    -- AppRouter.jsx: Create route for Library component if user is logged in, restrict access otherwise.
    -- StoreGameCard.jsx: Disable "+ Add to Library" button if logged out.
    -- Home.jsx: Welcome message.
    -- Profile.jsx: Display current user.
    -- App.jsx: Fetch Library if user is logged.
    setCurrentUser:
    -- Profile.jsx: Remove current user on log out.
    signupServer():
    -- Signup.jsx: Initiate server-side sign up.
    authenticateUsingToken:
    -- App.jsx to authenticate using JWT token on app start.
    quickLogin():
    -- NavbarMain.jsx: "Quick Login" nav link in development mode.
    loginServer():
    -- Login.jsx: Initiate server-side login.

    # --- StoreProvider --- #
    storeList:
    -- AppRouter.jsx: Create a route for each playable game in the list.
    -- Library.jsx: Get game info since LibraryList doesn't have game info attached.
    loadStore():
    -- App.jsx: Load Store games.

    # --- LibraryProvider --- #
    libraryList:
    -- Library.jsx: Iterate through Library games to display game cards.
    librarySet:
    -- StoreGameCard.jsx: Disable "+ Add to Library" button if game already in Library.
    loadLibrary():
    -- App.jsx: Load Library games.
    handleAddToLibrary():
    -- StoreGameCard.jsx: Add game to Library.
    handleRemoveLibrary():
    -- LibraryGameCard.jsx: Remove game from Library.

    # --- HighscoreProvider --- #
    loadHighScores():
    -- App.jsx: Fetch high score list from server.
    clearHighScores():
    -- App.jsx: Clear score list.
    getHighScore():
    -- Store.jsx: Display high score on game cards.
    -- Library.jsx: Display high score on game cards.
    -- AppRouter.jsx: Pass high score to GamePage component.
    getLastPlayed():
    -- Library.jsx: Display last played on game cards.
    submitScore():
    -- AppRouter.jsx: Pass submitScore handler to GamePage component.

    # --- LoadingProvider --- #
    isLoading
    -- AppRouter.jsx: Check whether to display loading page.
    startLoadingScreen()
    -- App.jsx: Indicate to open loading screen when authenticating user and fetching Store & Library.
    stopLoadingScreen()
    -- App.jsx: Indicate to close loading screen after authenticating user and fetching Store & Library.

    */

    // <StrictMode>
    <>
        <AuthProvider>
            <StoreProvider>
                <LibraryProvider>
                    <HighscoreProvider>
                        <LoadingProvider>
                            <App />
                        </LoadingProvider>
                    </HighscoreProvider>
                </LibraryProvider>
            </StoreProvider>
        </AuthProvider>
    </>
    // </StrictMode>
)
