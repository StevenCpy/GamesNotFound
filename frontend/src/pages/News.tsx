import { Link } from 'react-router-dom'
import './styling/News.css'

// components
import Section from "../components/texts/Section"

type ComparisonContainerProps = {
    src1: string
    alt1: string
    src2: string
    alt2: string
}

function ComparisonContainer( {src1, alt1, src2, alt2}: ComparisonContainerProps ) {
    return (
        <div className="comparison-container">
            <div className="comparison-left">
                <h3 className="header-title text-green">Before:</h3>
                <img src={src1} alt={alt1}></img>
            </div>
            <div className="comparison-right">
                <h3 className="header-title text-green">After:</h3>
                <img src={src2} alt={alt2}></img>
            </div>
        </div>
    )
}

function News() {
    return (
        <div id="news-page-container">
            <h1 className="header-title text-green"> What's NEW! </h1>
            <ul id="news-list" className="ul-dash">
                <Section title="JUNE 3, 2026">
                    <li> Created "What's NEW" page to share new features and changelogs. </li>
                    <li>
                        Created first game called "Hit the Target".{" "}
                        <Link className="text-green" to="/games/HitTheTarget">Link to game</Link>
                    </li>
                    <li>
                        Improved site layout.<br />
                        <ComparisonContainer
                            src1={`/news-images/Store page Old.png`} alt1="Store page Old"
                            src2={`/news-images/Store page New.png`} alt2="Store page New"
                        />
                    </li>
                </Section>

                <Section title="JUNE 4, 2026">
                    <li> Persistent login using JWT token authentication, stay logged in when refreshing browser. </li>
                </Section>

                <Section title="JUNE 6, 2026">
                    <li> Created v2 API endpoints and updated client to use the new endpoints. </li>
                </Section>

                <Section title="JUNE 10, 2026">
                    <li>
                        Added "High Score" feature for playable games.  Scores are submitted automatically on game completion
                        and high score updated accordingly.
                    </li>
                    <li> Fixed target spawning outside playable area for "Hit the Target" game. </li>
                    <li> Added "Last Played" to game cards which gives the last time you submitted a score. </li>
                </Section>

                <Section title="JUNE 12, 2026">
                    <li> Fixed CSS layout issues for mobile devices and smaller screen sizes. </li>
                </Section>
                
                <Section title="JUNE 13, 2026">
                    <li> Added toasts to actions like JWT authentication, log in, log out, and adding & removing games from Library. </li>
                    <li> Updated Homepage with current and upcoming features. </li>
                    <li> Added Loading page & delays to allow time for Store & Library resources to load, making initial UI loading smoother. </li>
                    <li> Game covers fetched from remote storage, lighter client.</li>
                    <li> Password masking + Show/Hide password toggle in Signup/Login forms, and server-side password encryption.</li>
                </Section>

                <Section title="JUNE 14, 2026">
                    <li> Sorting dropdown on Store page to sort games by ID or name, preference saved on browser.</li>
                    <li> Game search on Store page to search games by name.</li>
                    <li> Site UI improvements.</li>
                    <h2 className="header-title text-green">Signup form</h2>
                    <ComparisonContainer
                        src1={`/news-images/Signup form Old.png`} alt1="Signup form Old"
                        src2={`/news-images/Signup form New.png`} alt2="Signup form New"
                    />
                    <h2 className="header-title text-green">News page</h2>
                    <ComparisonContainer
                        src1={`/news-images/News page Old.png`} alt1="News page Old"
                        src2={`/news-images/News page New.png`} alt2="News page New"
                    />
                </Section>

            </ul>
        </div>
    )
}

export default News