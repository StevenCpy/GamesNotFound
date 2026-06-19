import './FileUpload.css'

function FileUpload( {setValue} ) {
    return (
        <form>
            <label>Upload profile picture</label>
            <input
                type="file"
                accept="image/png"
                onChange={(e) => setValue(e.target.value)}
            />
        </form>
    )
}

export default FileUpload