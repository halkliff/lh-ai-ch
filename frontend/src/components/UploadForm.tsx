import { FormEvent, useState } from 'react'
import { uploadDocument } from '../api'
import { useMutate } from '../hooks/useMutate'

function UploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  const {
    mutate: uploadDoc,
    pending: uploading,
    reset,
  } = useMutate({
    mutator: uploadDocument,
    onSuccess: () => setFile(null),
    onError: () => setError('Failed to upload document'),
  })

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!file) return

    if (error) setError(null)
    reset()

    await uploadDoc(file)

    e.currentTarget?.reset()
    window.location.reload()
  }

  return (
    <div className="upload-form">
      <h2>Upload Document</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          onChange={(e) => setFile(e.currentTarget.files?.[0] ?? null)}
          disabled={uploading}
        />
        <button
          type="submit"
          disabled={!file || uploading}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  )
}

export default UploadForm
