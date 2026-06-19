function isoToLocaleDateString(isoDate) {
    const date = new Date(isoDate)
    const options = {
        year: "numeric",
        month: "long",
        day: "numeric"
    }
    return date.toLocaleDateString("en-CA", options)
}

export default isoToLocaleDateString