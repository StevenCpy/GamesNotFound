function RestrictedResource() {
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
            Restricted Access<br></br>
            Only logged in users can access this page
        </div>
    </div>
}

export default RestrictedResource