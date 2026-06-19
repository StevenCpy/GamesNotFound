import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './AppRouter.css'

// contexts
import { useAuth } from "./contexts/AuthContext"
import { useStore } from "./contexts/StoreContext"
import { useHighscore } from "./contexts/HighscoreContext"
import { useLoading } from './contexts/LoadingContext'

// components
import NavbarMain from "./navigation/NavbarMain"
import * as games from "../games/index.js"

type GameName = keyof typeof games

// pages
import Home from "../pages/Home"
import Store from "../pages/Store"
import Library from "../pages/Library"
import News from "../pages/News"
import Profile from "../pages/Profile"
import Signup from "../pages/Signup"
import Login from "../pages/Login"
import Error404 from "../pages/Error404"
import RestrictedResource from "../pages/RestrictedResource"
import LoadingPage from "../pages/LoadingPage"
import GamePage from "../games/GamePage"

function AppRouter() {
    const { currentUser } = useAuth()
    const { storeList } = useStore()
    const { getHighScore, submitScore } = useHighscore()
    const { isLoading } = useLoading()

    return (
        <BrowserRouter>
            <NavbarMain />

            <div id="page-container">
                <Routes>
                    {isLoading ?
                    <Route path="*" element={<LoadingPage />} />
                    : (<>
                        <Route path="/" element={<Home />} />
                        <Route path="/store" element={<Store />} />
                        <Route path="/library" element={currentUser ? <Library /> : <RestrictedResource />} />
                        <Route path="/profile" element={currentUser ? <Profile /> : <RestrictedResource />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/news" element={<News />} />

                        <Route path="*" element={<Error404 />} /> {/* Error page for invalid URLs */}

                        {/* Dynamically define routes for playable games */}
                        {storeList.map(game => {
                            if (game["is_playable"]) {
                                const gameFileName = game["name"].replaceAll(" ","") as GameName
                                const Component = games[gameFileName]
                                const gameID = game["gameID"]
                                const highScore = getHighScore(gameID)

                                return (
                                    <Route path={`games/${gameFileName}`}
                                            element={<GamePage gameName={game["name"]}
                                                                highScore={highScore}
                                                                game={<Component submitScore={(score: number) => submitScore(gameID, score) } />}
                                                    />}
                                    />
                                )
                            }
                        })}

                    </>)}
                </Routes>
            </div>
        </BrowserRouter>
    )
}

export default AppRouter