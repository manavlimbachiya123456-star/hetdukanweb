import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api.js'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data))
      window.dispatchEvent(new Event('auth-changed'))
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-14">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white border border-black/5 rounded-xl2 shadow-card p-8">
        <div className="text-center mb-8">
          <span className="font-script text-5xl text-sage">Vaishali</span>
          <p className="text-xs text-muted mt-1 tracking-wide">SIGN IN TO YOUR ACCOUNT</p>
        </div>

        {error && (
          <p className="text-sm text-plum bg-plum/5 border border-plum/20 rounded-lg px-3 py-2 mb-4">{error}</p>
        )}

        <label className="block text-sm mb-1.5">Email</label>
        <input
          type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
          className="w-full border border-black/10 rounded-lg px-3.5 py-2.5 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage"
        />

        <label className="block text-sm mb-1.5">Password</label>
        <input
          type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
          className="w-full border border-black/10 rounded-lg px-3.5 py-2.5 mb-6 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage"
        />

        <button type="submit" disabled={loading}
          className="w-full bg-sage text-ivory py-3 rounded-lg text-sm shadow-soft hover:bg-sage-dark hover:shadow-lift transition-all disabled:opacity-60">
          {loading ? 'Signing in...' : 'Sign in'}
        </button>

        <p className="text-center text-sm text-muted mt-5">
          New here? <Link to="/register" className="text-sage font-medium">Create an account</Link>
        </p>
      </form>
    </div>
  )
}

export default Login
