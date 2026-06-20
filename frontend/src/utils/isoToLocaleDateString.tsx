function isoToLocaleDateString(isoDate: string) : string {
    const date = new Date(isoDate)
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric"
    }
    return date.toLocaleDateString("en-CA", options)
}

export default isoToLocaleDateString