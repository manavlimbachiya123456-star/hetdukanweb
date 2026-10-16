import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../context/AdminAuthContext.jsx'

function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAdminAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white border border-black/5 rounded-sm p-8">
        <div className="text-center mb-8">
          <span className="font-script text-5xl text-sage">Vaishali</span>
          <p className="text-xs text-muted mt-1 tracking-wide">ADMIN PANEL</p>
        </div>

        {error && (
          <p className="text-sm text-plum bg-plum/5 border border-plum/20 rounded-sm px-3 py-2 mb-4">
            {error}
          </p>
        )}

        <label className="block text-sm mb-1.5">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-black/10 rounded-sm px-3 py-2.5 mb-4 text-sm focus:outline-none focus:border-sage"
        />

        <label className="block text-sm mb-1.5">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border border-black/10 rounded-sm px-3 py-2.5 mb-6 text-sm focus:outline-none focus:border-sage"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-sage text-ivory py-2.5 rounded-sm text-sm hover:bg-sage-dark transition-colors disabled:opacity-60"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}

export default AdminLogin
