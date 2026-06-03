import { useContext } from "react"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthContext } from "./contexts/AuthContext"
import { StoreContext } from "./contexts/StoreContext"
import NavbarMain from "./navigation/NavbarMain"

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

import GamePage from "../games/GamePage.jsx"
import * as games from "../games/index.js"


function AppRouter() {
    const { currentUser } = useContext(AuthContext)
    const { storeList } = useContext(StoreContext)

    return (
        <BrowserRouter>
            <div id="app-container"
            style={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                flexDirection: "column"
            }}>
                <NavbarMain />

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/store" element={<Store />} />
                    <Route path="/library" element={currentUser ? <Library /> : <RestrictedResource />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/news" element={<News />} />

                    <Route path="*" element={<Error404 />} /> {/* Error page for invalid URLs */}

                    {/* Dynamically define routes for playable games */}
                    {storeList.map(game => {
                        if (game["is_playable"]) {
                            const gameFileName = game["name"].replaceAll(" ","")
                            const Component = games[gameFileName]
                            return (
                                <Route path={`games/${gameFileName}`}
                                        element={<GamePage gameName={game["name"]} game={< Component />} />}
                                />
                            )
                        }
                    })}
                </Routes>
            </div>
            
        </BrowserRouter>
    )
}

export default AppRouter