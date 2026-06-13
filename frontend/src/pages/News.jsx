import { Link } from 'react-router-dom'
import './styling/News.css'

function ComparisonContainer({ src1, alt1, src2, alt2 }) {
    return (
        <div className="side-by-side-comparison">
            <span className="layout-left">
                <h3>Old layout:</h3><br />
                <img src={src1} alt={alt1}></img>
            </span>
            <span className="layout-right">
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
                <li> Created "What's NEW" page to share new features and changelogs. </li>
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
                <li> Created v2 API endpoints and updated client to use the new endpoints. </li>
                <li>
                    Added "High Score" feature for playable games.  Scores are submitted automatically on game completion
                    and high score updated accordingly.
                </li>
                <li> Added "Last Played" to game cards which gives the last time you submitted a score. </li>
                <li> Fixed CSS layout issues for mobile devices and smaller screen sizes. </li>
                <li> Added toasts to actions like JWT authentication, log in, log out, and adding & removing games from Library. </li>
                <li> Updated Homepage with current and upcoming features. </li>
                <li> Added Loading page & delays to allow time for Store & Library resources to load, making initial UI loading smoother. </li>
            </ul>
            
        </div>
    )
}

export default News