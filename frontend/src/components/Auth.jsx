import { useState } from 'react'
import axios from 'axios'
import './Auth.css'

function Auth({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await axios.post('/api/auth/login', { password })
      if (response.data.success) {
        localStorage.setItem('auth', 'true')
        onLogin()
      }
    } catch (err) {
      setError('Invalid password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="auth-title">Team Forum Dashboard</h1>
        <p className="auth-subtitle">Enter your access password</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="password" className="sr-only">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            disabled={loading}
            aria-label="Password"
            required
          />
          {error && <p className="error" role="alert">{error}</p>}
          <button type="submit" disabled={loading} aria-busy={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Auth
