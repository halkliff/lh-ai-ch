import { Link } from 'react-router-dom'
import { getDocuments } from '../api'
import { useFetch } from '../hooks/useFetch'

function DocumentList() {

  const { data: documents, loading, error, refetch } = useFetch(getDocuments)

  if (loading) {
    return <div className="loading">Loading documents...</div>
  }

  if (error) {
    return <div className="error" onClick={() => refetch()}>Failed to load documents</div>
  }

  return (
    <div className="document-list">
      <h2>Documents</h2>
      {documents.length === 0 ? (
        <div className="empty-state">
          No documents uploaded yet. Upload a PDF to get started.
        </div>
      ) : (
        documents.map(doc => (
          <div key={doc.id} className="document-item">
            <div>
              <Link to={`/documents/${doc.id}`}>{doc.filename}</Link>
              <div className="document-meta">
                {doc.page_count} pages | {formatFileSize(doc.file_size)} | {doc.status}
              </div>
            </div>
            <div className="document-meta">
              {new Date(doc.created_at).toLocaleDateString()}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

function formatFileSize(bytes: number) {
  if (!bytes) return 'Unknown size'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

export default DocumentList
