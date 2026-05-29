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

function AppRouter() {
    const { currentUser } = useContext(AuthContext)

    return (
        <BrowserRouter>
            <NavbarMain />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Store" element={<Store />} />
                <Route path="/Library" element={currentUser ? <Library /> : <RestrictedResource />} />
                <Route path="/Profile" element={<Profile />} />
                <Route path="/Signup" element={<Signup />} />
                <Route path="/Login" element={<Login />} />

                <Route path="*" element={<Error404 />} /> {/* Error page for invalid URLs */}
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter