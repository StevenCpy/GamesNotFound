// prints the log for componentName to console if in development mode
function devLog(componentName, message) {
    if (import.meta.env.DEV) {
        console.log(`${componentName.toUpperCase()}: ${message}`)
    }
}

export default devLog