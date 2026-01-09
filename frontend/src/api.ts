const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export interface UploadFileResponse {
  id: number
  filename: string
}

export interface GetDocumentResponse {
  filename: string
  id: number
  file_size: number
  page_count: number
  status: string
  created_at: string
  content: string
}

export interface DeleteDocumentResponse {
  message: string
}

export interface SearchResult {
  id: number
  filename: string
  snippet: string
}

export type SearchDocumentsResponse = SearchResult[]

export async function uploadDocument(file: File): Promise<UploadFileResponse> {
  const formData = new FormData()
  formData.append('file', file)
  const response = await fetch(`${API_BASE}/documents`, {
    method: 'POST',
    body: formData,
  })
  return response.json()
}

export async function getDocuments(): Promise<
  Omit<GetDocumentResponse, 'content'>[]
> {
  const response = await fetch(`${API_BASE}/documents`)
  return response.json()
}

export async function getDocument(id: string): Promise<GetDocumentResponse> {
  const response = await fetch(`${API_BASE}/documents/${id}`)
  return response.json()
}

export async function deleteDocument(
  id: string
): Promise<DeleteDocumentResponse> {
  const response = await fetch(`${API_BASE}/documents/${id}`, {
    method: 'DELETE',
  })
  return response.json()
}

export async function searchDocuments(query: string): Promise<SearchDocumentsResponse> {
  const response = await fetch(
    `${API_BASE}/search?q=${encodeURIComponent(query)}`
  )
  return response.json()
}
