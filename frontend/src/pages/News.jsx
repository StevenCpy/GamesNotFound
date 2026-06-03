import { Link } from "react-router-dom"

function News() {
    return (
        <div>
            <h1> What's NEW! </h1>
            - Created game called "Hit the Target".  <Link style={{ color: "red" }} to="/games/HitTheTarget">Quick link to game</Link>
            
        </div>
    )
}

export default News