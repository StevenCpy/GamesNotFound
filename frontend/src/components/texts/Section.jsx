import './Section.css'

function Section( {title, children} ) {
    return (
        <div className="section">
            <h2 className="header-title text-green">{title}</h2>
            {children}
        </div>
    )
}

export default Section