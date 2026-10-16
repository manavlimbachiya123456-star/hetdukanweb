import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api.js'
import { sendOtp } from '../services/firebase.js'

function Register() {
  const [step, setStep] = useState('details')
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [otp, setOtp] = useState('')
  const [confirmationResult, setConfirmationResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSendOtp = async (e) => {
    e.preventDefault()
    setError('')

    const digits = form.phone.replace(/\D/g, '')
    if (digits.length !== 10) {
      setError('Enter a valid 10-digit phone number.')
      return
    }

    setLoading(true)
    try {
      const result = await sendOtp(`+91${digits}`, 'recaptcha-container')
      setConfirmationResult(result)
      setStep('otp')
    } catch (err) {
      setError(err.message?.includes('too-many-requests')
        ? 'Too many attempts. Please try again later.'
        : 'Could not send OTP. Check the number and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setError('')

    if (otp.length !== 6) {
      setError('Enter the 6-digit code.')
      return
    }

    setLoading(true)
    try {
      const credential = await confirmationResult.confirm(otp)
      const idToken = await credential.user.getIdToken()

      const { data } = await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
        idToken,
      })

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data))
      window.dispatchEvent(new Event('auth-changed'))
      navigate('/')
    } catch (err) {
      if (err.code === 'auth/invalid-verification-code') {
        setError('Incorrect code. Please try again.')
      } else {
        setError(err.response?.data?.message || 'Verification failed.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-14">
      <div id="recaptcha-container" />

      {step === 'details' ? (
        <form onSubmit={handleSendOtp} className="w-full max-w-sm bg-white border border-black/5 rounded-xl2 shadow-card p-8">
          <div className="text-center mb-8">
            <span className="font-script text-5xl text-sage">Vaishali</span>
            <p className="text-xs text-muted mt-1 tracking-wide">CREATE YOUR ACCOUNT</p>
          </div>

          {error && (
            <p className="text-sm text-plum bg-plum/5 border border-plum/20 rounded-lg px-3 py-2 mb-4">{error}</p>
          )}

          <label className="block text-sm mb-1.5">Name</label>
          <input
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
            className="w-full border border-black/10 rounded-lg px-3.5 py-2.5 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage"
          />

          <label className="block text-sm mb-1.5">Email</label>
          <input
            type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required
            className="w-full border border-black/10 rounded-lg px-3.5 py-2.5 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage"
          />

          <label className="block text-sm mb-1.5">Phone Number</label>
          <div className="flex mb-4">
            <span className="flex items-center px-3 border border-r-0 border-black/10 rounded-l-lg text-sm text-muted bg-stone/40">+91</span>
            <input
              type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required
              placeholder="98765 43210" maxLength={10}
              className="w-full border border-black/10 rounded-r-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage"
            />
          </div>

          <label className="block text-sm mb-1.5">Password</label>
          <input
            type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6}
            className="w-full border border-black/10 rounded-lg px-3.5 py-2.5 mb-6 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage"
          />

          <button type="submit" disabled={loading}
            className="w-full bg-sage text-ivory py-3 rounded-lg text-sm shadow-soft hover:bg-sage-dark hover:shadow-lift transition-all disabled:opacity-60">
            {loading ? 'Sending code...' : 'Send OTP'}
          </button>

          <p className="text-center text-sm text-muted mt-5">
            Already have an account? <Link to="/login" className="text-sage font-medium">Sign in</Link>
          </p>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="w-full max-w-sm bg-white border border-black/5 rounded-xl2 shadow-card p-8 text-center">
          <span className="font-script text-5xl text-sage">Vaishali</span>
          <p className="font-serif text-xl text-sage-dark mt-4">Verify your phone</p>
          <p className="text-sm text-muted mt-1 mb-6">
            We sent a 6-digit code via SMS to <span className="text-ink">+91 {form.phone}</span>
          </p>

          {error && (
            <p className="text-sm text-plum bg-plum/5 border border-plum/20 rounded-lg px-3 py-2 mb-4">{error}</p>
          )}

          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            maxLength={6}
            inputMode="numeric"
            placeholder="000000"
            autoFocus
            className="w-full text-center text-2xl tracking-[0.5em] border border-black/10 rounded-lg px-3.5 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage"
          />

          <button type="submit" disabled={loading}
            className="w-full bg-sage text-ivory py-3 rounded-lg text-sm shadow-soft hover:bg-sage-dark hover:shadow-lift transition-all disabled:opacity-60">
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </button>

          <button type="button" onClick={() => setStep('details')} className="text-sm text-sage mt-4">
            Change phone number
          </button>
        </form>
      )}
    </div>
  )
}

export default Register
