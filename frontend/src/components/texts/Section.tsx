import './Section.css'

type SectionProps = {
    title: string
    children: React.ReactNode
}

function Section( {title, children}: SectionProps ) {
    return (
        <div className="section">
            <h2 className="header-title text-green">{title}</h2>
            {children}
        </div>
    )
}

export default Section