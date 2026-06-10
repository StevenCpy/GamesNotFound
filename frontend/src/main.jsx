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
    currentUser used by Profile and Home pages
    setCurrentUser used by Login and Log out features
    libraryList used by Library to display library games
    setLibraryList used by Store whenever user adds game to library, and Library to remove a game
    librarySet used by Store to disable "+ Add to library button"
    setLibrarySet used by Store whenever user adds game to library, and Library to remove a game
    storeList used by Store to display store games, and Library to check for game info
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
