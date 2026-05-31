import { useContext } from "react"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthContext } from "./contexts/AuthContext"
import NavbarMain from "./navigation/NavbarMain"

// pages
import Home from "../pages/Home"
import Store from "../pages/Store"
import Library from "../pages/Library"
import Profile from "../pages/Profile"
import Signup from "../pages/Signup"
import Login from "../pages/Login"
import Error404 from "../pages/Error404"
import RestrictedResource from "../pages/RestrictedResource"
import HitTheTarget from "../games/Hit the Target/Hit the Target"

function AppRouter() {
    const { currentUser } = useContext(AuthContext)

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
                    <Route path="/Store" element={<Store />} />
                    <Route path="/Library" element={currentUser ? <Library /> : <RestrictedResource />} />
                    <Route path="/Profile" element={<Profile />} />
                    <Route path="/Signup" element={<Signup />} />
                    <Route path="/Login" element={<Login />} />

                    <Route path="*" element={<Error404 />} /> {/* Error page for invalid URLs */}
                    {import.meta.env.DEV && <Route path="/games/HitTheTarget" element={<HitTheTarget />} />}
                </Routes>
            </div>
            
        </BrowserRouter>
    )
}

export default AppRouter