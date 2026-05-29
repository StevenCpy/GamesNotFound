function Error404() {
    return <div style={{
        display: "flex",
        flexDirection: "column",
        height: "50vh",
        justifyContent: "center",
        alignItems: "center"
    }}>
        <div style={{
            fontWeight: "bold",
            fontSize: "200%",
            textAlign: "center"
        }}>
            404<br></br>
            Page Not Found
        </div>
        Sorry but you shouldn't be here
    </div>
}

export default Error404