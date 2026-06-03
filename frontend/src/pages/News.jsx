import { Link } from "react-router-dom"

import './styling/News.css'

function News() {
    return (
        <div id="news-page">
            <h1> What's NEW! </h1>
            <ul className="ul-dash">
                <li>
                    Created the "What's NEW" page to share new features and changelogs."
                </li>
                <li>
                    Created first game called "Hit the Target".{" "}
                    <Link style={{ color: "green" }} to="/games/HitTheTarget">Quick link to game</Link>
                </li>
                <li>
                    Improved site layout.<br />
                    <div id="layout-change">
                        <span>
                            Old layout:<br />
                            <img src={`/news-images/Old layout.png`} alt="Old layout"></img>
                        </span>
                        <span>
                            New layout:<br />
                            <img src={`/news-images/New layout.png`} alt="New layout"></img>
                        </span>
                    </div>
                    
                </li>
            </ul>
            
        </div>
    )
}

export default News