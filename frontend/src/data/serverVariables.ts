const LOCAL_SERVER_URL = import.meta.env.VITE_LOCAL_SERVER_URL ?? "http://localhost:8000" // in case VITE_LOCAL_SERVER_URL not set locally
const SERVER_URL = import.meta.env.DEV ? LOCAL_SERVER_URL : import.meta.env.VITE_SERVER_URL

export default SERVER_URL