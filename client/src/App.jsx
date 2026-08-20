import { useEffect, useState } from 'react'
import './App.css'

const API_BASE_URL = 'http://localhost:5000'

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [authMode, setAuthMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authStatus, setAuthStatus] = useState('')
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  const [selectedFile, setSelectedFile] = useState(null)
  const [status, setStatus] = useState('')
  const [documentation, setDocumentation] = useState('')
  const [downloadUrl, setDownloadUrl] = useState('')
  const [documents, setDocuments] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const loadDocuments = async () => {
    const response = await fetch(`${API_BASE_URL}/api/docs`, {
      credentials: 'include',
    })

    if (!response.ok) {
      return
    }

    const data = await response.json()
    setDocuments(data.documents || [])
  }

  useEffect(() => {
    const checkCurrentUser = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          credentials: 'include',
        })

        if (!response.ok) {
          return
        }

        const data = await response.json()
        setCurrentUser(data.user)
        await loadDocuments()
      } finally {
        setIsCheckingAuth(false)
      }
    }

    checkCurrentUser()
  }, [])

  const handleAuthSubmit = async (event) => {
    event.preventDefault()
    setAuthStatus('')

    const endpoint = authMode === 'login' ? 'login' : 'register'
    const payload = authMode === 'login'
      ? { email, password }
      : { name, email, password }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed')
      }

      setCurrentUser(data.user)
      setName('')
      setPassword('')
      setAuthStatus('')
      await loadDocuments()
    } catch (error) {
      setAuthStatus(
        error.message === 'Failed to fetch'
          ? 'Could not reach the backend. Make sure the server is running on port 5000.'
          : error.message
      )
    }
  }

  const handleLogout = async () => {
    await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    })

    setCurrentUser(null)
    setSelectedFile(null)
    setStatus('')
    setDocumentation('')
    setDownloadUrl('')
    setDocuments([])
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    setSelectedFile(file)
    setStatus('')
    setDocumentation('')
    setDownloadUrl('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!selectedFile) {
      setStatus('Please choose a zip file first.')
      return
    }

    const formData = new FormData()
    formData.append('codebase', selectedFile)

    try {
      setIsLoading(true)
      setStatus('Uploading codebase and generating documentation...')
      setDocumentation('')
      setDownloadUrl('')

      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong')
      }

      setDocumentation(data.documentation)
      setDownloadUrl(`${API_BASE_URL}${data.documentationDownloadUrl}`)
      setStatus('Documentation generated successfully.')
      await loadDocuments()
    } catch (error) {
      setStatus(
        error.message === 'Failed to fetch'
          ? 'Could not reach the backend. Make sure the server is running on port 5000.'
          : error.message
      )
    } finally {
      setIsLoading(false)
    }
  }

  if (isCheckingAuth) {
    return (
      <main className="app-shell">
        <div className="loading-screen">Loading DocuMind AI...</div>
      </main>
    )
  }

  return (
    <main className="app-shell">
      <header className="site-header">
        <div className="brand">
          <span className="brand-mark">D</span>
          <span>DocuMind AI</span>
        </div>

        {currentUser && (
          <div className="user-menu">
            <span>{currentUser.name}</span>
            <button type="button" className="ghost-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </header>

      <section className="hero-card">
        <div className="hero-top">
          <div className="hero-copy">
            <p className="eyebrow">AI documentation workspace</p>
            <h1>Turn any code archive into polished project documentation.</h1>
            <p className="subtitle">
              Upload a zipped project, let the backend scan the code, and receive clear Markdown documentation with a downloadable output.
            </p>

            <ul className="feature-list">
              <li>Zip uploads with secure account access</li>
              <li>Smart code scanning and extraction</li>
              <li>AI-generated Markdown with saved history</li>
            </ul>
          </div>

          {currentUser ? (
            <div className="upload-card">
              <form className="upload-form" onSubmit={handleSubmit}>
                <label className="file-picker">
                  <span>{selectedFile ? selectedFile.name : 'Choose a .zip file'}</span>
                  <input
                    type="file"
                    accept=".zip"
                    onChange={handleFileChange}
                  />
                </label>

                <button type="submit" disabled={isLoading}>
                  {isLoading ? 'Generating...' : 'Generate Documentation'}
                </button>
              </form>

              <p className={`status-text ${isLoading ? 'status-loading' : ''}`} role="status">
                {status || 'Drop in your project archive and create docs in seconds.'}
              </p>
            </div>
          ) : (
            <div className="auth-card">
              <div className="auth-tabs">
                <button
                  type="button"
                  className={authMode === 'login' ? 'active' : ''}
                  onClick={() => setAuthMode('login')}
                >
                  Login
                </button>
                <button
                  type="button"
                  className={authMode === 'register' ? 'active' : ''}
                  onClick={() => setAuthMode('register')}
                >
                  Register
                </button>
              </div>

              <form className="auth-form" onSubmit={handleAuthSubmit}>
                {authMode === 'register' && (
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                )}

                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />

                <button type="submit">
                  {authMode === 'login' ? 'Login' : 'Create Account'}
                </button>
              </form>

              {authStatus && <p className="status-text">{authStatus}</p>}
            </div>
          )}
        </div>
      </section>

      {currentUser && (
        <>
          <section className="dashboard-card">
            <div className="result-header">
              <h2>Scanned Documents Dashboard</h2>
              <button type="button" className="ghost-button" onClick={loadDocuments}>
                Refresh
              </button>
            </div>

            {documents.length > 0 ? (
              <div className="document-list">
                {documents.map((document) => (
                  <article className="document-row" key={document.fileName}>
                    <div>
                      <h3>{document.fileName}</h3>
                      <p>
                        {Math.round(document.size / 1024)} KB - {new Date(document.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="document-actions">
                      <a href={`${API_BASE_URL}${document.viewUrl}`} target="_blank" rel="noreferrer">
                        View
                      </a>
                      <a href={`${API_BASE_URL}${document.downloadUrl}`}>
                        Download
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state small">
                Your generated documents will appear here.
              </div>
            )}
          </section>

          <section className="result-card">
            <div className="result-header">
              <h2>Documentation Output</h2>

              {downloadUrl && (
                <a href={downloadUrl}>
                  Download Markdown
                </a>
              )}
            </div>

            {documentation ? (
              <pre className="documentation-box">{documentation}</pre>
            ) : (
              <div className="empty-state">
                Generated documentation will appear here after your upload finishes.
              </div>
            )}
          </section>
        </>
      )}
    </main>
  )
}

export default App
