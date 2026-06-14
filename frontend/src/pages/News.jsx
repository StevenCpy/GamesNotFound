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
                <h2 className="header-title text-green">JUNE 3, 2026</h2>
                <li> Created "What's NEW" page to share new features and changelogs. </li>
                <li>
                    Created first game called "Hit the Target".{" "}
                    <Link className="text-green" to="/games/HitTheTarget">Quick link to game</Link>
                </li>
                <li>
                    Improved site layout.<br />
                    <ComparisonContainer
                        src1={`/news-images/Old Store layout.png`} alt1="Old Store layout"
                        src2={`/news-images/New Store layout.png`} alt2="New Store layout"
                    />
                </li>

                <h2 className="header-title text-green">JUNE 4, 2026</h2>
                <li> Persistent login using JWT token authentication, stay logged in when refreshing browser. </li>

                <h2 className="header-title text-green">JUNE 6, 2026</h2>
                <li> Created v2 API endpoints and updated client to use the new endpoints. </li>

                <h2 className="header-title text-green">JUNE 10, 2026</h2>
                <li>
                    Added "High Score" feature for playable games.  Scores are submitted automatically on game completion
                    and high score updated accordingly.
                </li>
                <li> Fixed target spawning outside playable area for "Hit the Target" game. </li>
                <li> Added "Last Played" to game cards which gives the last time you submitted a score. </li>

                <h2 className="header-title text-green">JUNE 12, 2026</h2>
                <li> Fixed CSS layout issues for mobile devices and smaller screen sizes. </li>

                <h2 className="header-title text-green">JUNE 13, 2026</h2>
                <li> Added toasts to actions like JWT authentication, log in, log out, and adding & removing games from Library. </li>
                <li> Updated Homepage with current and upcoming features. </li>
                <li> Added Loading page & delays to allow time for Store & Library resources to load, making initial UI loading smoother. </li>
                <li> Game covers fetched from remote storage, lighter client.</li>
                <li> Password masking + Show/Hide password toggle in Signup/Login forms, and server-side password encryption.</li>

                <h2 className="header-title text-green">JUNE 14, 2026</h2>
                <li> Sorting dropdown on Store page to sort games by ID or name, preference saved on browser.</li>
                <li> Game search on Store page to search games by name.</li>

            </ul>
        </div>
    )
}

export default News