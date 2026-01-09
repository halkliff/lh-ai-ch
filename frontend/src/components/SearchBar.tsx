import React, { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { searchDocuments } from '../api'
import { useFetch } from '../hooks/useFetch'

function SearchBar() {
  const [queryStr, setQueryStr] = useState('')
  const [query, setQuery] = useState('')
  const [showResults, setShowResults] = useState(false)

  const getResults = useCallback(async () => {
    const q = query.trim()
    if (!q) return []
    return await searchDocuments(q)
  }, [query])

  const { data: results, loading: searching, error } = useFetch(getResults)

  console.debug('SearchBar: render', { results, searching, error })

  async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setQuery(queryStr)
  }

  return (
    <div
      className="search-container"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setShowResults(false)
        }
      }}
    >
      <form
        className="search-bar"
        onSubmit={handleSearch}
        onFocus={() => setShowResults(true)}
      >
        <input
          type="text"
          placeholder="Search documents..."
          value={queryStr}
          onChange={(e) => setQueryStr(e.target.value)}
        />
        <button
          type="submit"
          disabled={searching}
        >
          {searching ? '...' : 'Search'}
        </button>
      </form>
      {showResults && (
        <div className="search-results" role="dialog" tabIndex={1}>
          {results.length === 0 ? (
            <div className="result-item">No results found</div>
          ) : (
            results.map((result) => (
              <div
                key={result.id}
                className="result-item"
              >
                <Link
                  to={`/documents/${result.id}`}
                  onClick={() => setShowResults(false)}
                >
                  {result.filename}
                </Link>
                <div className="snippet">{result.snippet}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default SearchBar
