import { useState } from 'react'
import { uploadDocument } from '../api'

function UploadForm() {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!file) return

    try {
      setUploading(true)
      setError(null)
      await uploadDocument(file)
      setFile(null)
      e.target.reset()
      window.location.reload()
    } catch (err) {
      setError('Failed to upload document')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="upload-form">
      <h2>Upload Document</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          disabled={uploading}
        />
        <button type="submit" disabled={!file || uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  )
}

export default UploadForm
