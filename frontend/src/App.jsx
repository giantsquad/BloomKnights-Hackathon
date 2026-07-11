import { useEffect, useState } from 'react'
import './App.css'

// Empty string in dev keeps requests going through the Vite proxy (see vite.config.js).
// In production, set VITE_API_URL to the deployed backend's URL.
const API_URL = import.meta.env.VITE_API_URL || ''

function App() {
  const [status, setStatus] = useState('checking...')

  useEffect(() => {
    fetch(`${API_URL}/api/health`)
      .then((res) => res.json())
      .then((data) => setStatus(data.status))
      .catch(() => setStatus('unreachable'))
  }, [])

  return (
    <div className="app">
      <h1>BloomKnights</h1>
      <p>Backend status: {status}</p>
    </div>
  )
}

export default App
