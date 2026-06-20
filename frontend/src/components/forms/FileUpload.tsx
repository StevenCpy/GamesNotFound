import './FileUpload.css'

type FileUploadProps = {
    setValue: React.Dispatch<React.SetStateAction<any>>
}

function FileUpload( {setValue}: FileUploadProps ) {
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