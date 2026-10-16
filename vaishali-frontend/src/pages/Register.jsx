import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api.js'

const inputCls =
  'w-full border border-black/10 rounded-lg px-3.5 py-2.5 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage'

function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const digits = form.phone.replace(/\D/g, '')
    if (form.phone && digits.length !== 10) {
      setError('Enter a valid 10-digit phone number or leave it blank.')
      return
    }
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register', { ...form, phone: digits })
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data))
      window.dispatchEvent(new Event('auth-changed'))
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create account. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-14">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white border border-black/5 rounded-xl2 shadow-card p-8">
        <div className="text-center mb-8">
          <span className="font-script text-5xl text-sage">Vaishali</span>
          <p className="text-xs text-muted mt-1 tracking-wide">CREATE YOUR ACCOUNT</p>
        </div>

        {error && (
          <p className="text-sm text-plum bg-plum/5 border border-plum/20 rounded-lg px-3 py-2 mb-4">{error}</p>
        )}

        <label className="block text-sm mb-1.5">Name</label>
        <input value={form.name} onChange={set('name')} required className={inputCls} />

        <label className="block text-sm mb-1.5">Email</label>
        <input type="email" value={form.email} onChange={set('email')} required className={inputCls} />

        <label className="block text-sm mb-1.5">Phone <span className="text-muted">(optional)</span></label>
        <input type="tel" value={form.phone} onChange={set('phone')} maxLength={10} placeholder="98765 43210" className={inputCls} />

        <label className="block text-sm mb-1.5">Password</label>
        <input type="password" value={form.password} onChange={set('password')} required minLength={6} className={inputCls.replace('mb-4', 'mb-6')} />

        <button type="submit" disabled={loading}
          className="w-full bg-sage text-ivory py-3 rounded-lg text-sm shadow-soft hover:bg-sage-dark hover:shadow-lift transition-all disabled:opacity-60">
          {loading ? 'Creating account...' : 'Create Account'}
        </button>

        <p className="text-center text-sm text-muted mt-5">
          Already have an account? <Link to="/login" className="text-sage font-medium">Sign in</Link>
        </p>
      </form>
    </div>
  )
}

export default Register
