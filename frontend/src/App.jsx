import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Store from './pages/Store'

function App() {
  return (
    <BrowserRouter>
      <nav id="main-nav-bar">
        <Link to="/">GamesNotFound</Link> | {" "}
        <Link to="/Store">Store</Link>
      </nav>

      <Routes>
        <Route path="/" element={ <Home /> } />
        <Route path="/Store" element={ <Store /> } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
