import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Auth from './components/Auth'
import Dashboard from './pages/Dashboard'
import './App.css'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const auth = localStorage.getItem('auth')
    if (auth) {
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div className="app">
      {isAuthenticated ? (
        <Dashboard onLogout={() => {
          localStorage.removeItem('auth')
          setIsAuthenticated(false)
        }} />
      ) : (
        <Auth onLogin={() => {
          setIsAuthenticated(true)
        }} />
      )}
    </div>
  )
}

export default App
