import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getDocument, deleteDocument } from '../api.ts'
import { useFetch } from '../hooks/useFetch.tsx'
import { useMutate } from '../hooks/useMutate.tsx'

function DocumentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [error, setError] = useState<string | null>(null)

  const fetchDocument = useCallback(async () => getDocument(id!), [id])

  const {
    data: document,
    loading,
    error: loadDocumentError,
    refetch,
  } = useFetch(fetchDocument)

  const { mutate: deleteDoc, reset } = useMutate({
    mutator: async (id: string) => deleteDocument(id),
    onSuccess: () => navigate('/'),
    onError: () => setError('Failed to delete document'),
  })

  useEffect(() => {
    if (loadDocumentError) {
      setError('Failed to load document')
    }
  }, [loadDocumentError])

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this document?')) {
      return
    }

    if (error) setError(null)

    reset()
    await deleteDoc(id!)
  }

  if (loading) {
    return (
      <div
        className="loading"
        onClick={() => refetch()}
      >
        Loading document...
      </div>
    )
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  if (!document) {
    return <div className="error">Document not found</div>
  }

  return (
    <div className="document-detail">
      <h2>{document.filename}</h2>
      <div className="meta">
        <p>Status: {document.status}</p>
        <p>Pages: {document.page_count || 'Unknown'}</p>
        <p>Size: {formatFileSize(document.file_size)}</p>
        <p>Uploaded: {new Date(document.created_at).toLocaleString()}</p>
      </div>
      <h3>Extracted Content</h3>
      <div className="content">
        {document.content || 'No content extracted'}
      </div>
      <div className="actions">
        <button
          className="back-btn"
          onClick={() => navigate('/')}
        >
          Back to List
        </button>
        <button
          className="delete-btn"
          onClick={handleDelete}
        >
          Delete Document
        </button>
      </div>
    </div>
  )
}

function formatFileSize(bytes: number) {
  if (!bytes) return 'Unknown size'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

export default DocumentDetail
