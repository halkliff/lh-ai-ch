import { Routes, Route, Link } from 'react-router-dom'
import DocumentList from './components/DocumentList'
import DocumentDetail from './components/DocumentDetail'
import UploadForm from './components/UploadForm'
import SearchBar from './components/SearchBar'

function App() {
  return (
    <div className="app">
      <header className="header">
        <Link to="/" className="logo">
          <h1>DocProc</h1>
        </Link>
        <nav>
          <SearchBar />
        </nav>
      </header>
      <main className="main">
        <Routes>
          <Route path="/" element={
            <>
              <UploadForm />
              <DocumentList />
            </>
          } />
          <Route path="/documents/:id" element={<DocumentDetail />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
