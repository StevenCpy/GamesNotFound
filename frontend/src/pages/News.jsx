import { Link } from "react-router-dom"

import './styling/News.css'

function ComparisonContainer({ src1, alt1, src2, alt2 }) {
    return (
        <div class="side-by-side-comparison">
            <span class="layout-left">
                <h3>Old layout:</h3><br />
                <img src={src1} alt={alt1}></img>
            </span>
            <span class="layout-right">
                <h3>New layout:</h3><br />
                <img src={src2} alt={alt2}></img>
            </span>
        </div>
    )
}

function News() {
    return (
        <div id="news-page">
            <h1> What's NEW! </h1>
            <ul className="ul-dash">
                <li>
                    Created "What's NEW" page to share new features and changelogs.
                </li>
                <li>
                    Created first game called "Hit the Target".{" "}
                    <Link style={{ color: "green" }} to="/games/HitTheTarget">Quick link to game</Link>
                </li>
                <li>
                    Improved site layout.<br />
                    <ComparisonContainer
                        src1={`/news-images/Old Store layout.png`} alt1="Old Store layout"
                        src2={`/news-images/New Store layout.png`} alt2="New Store layout"
                    />
                </li>
            </ul>
            
        </div>
    )
}

export default News