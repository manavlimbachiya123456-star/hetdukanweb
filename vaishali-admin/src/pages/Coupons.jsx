import { useEffect, useState } from 'react'
import AdminLayout from '../components/layout/AdminLayout.jsx'
import { getCoupons, createCoupon } from '../services/adminService.js'

function Coupons() {
  const [coupons, setCoupons] = useState([])
  const [form, setForm] = useState({ code: '', discountPercent: '', expiresAt: '' })
  const [error, setError] = useState('')

  const load = async () => {
    const { data } = await getCoupons()
    setCoupons(data)
  }

  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await createCoupon(form)
      setForm({ code: '', discountPercent: '', expiresAt: '' })
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create coupon')
    }
  }

  return (
    <AdminLayout>
      <h1 className="font-serif text-3xl text-sage-dark mb-6">Coupons</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-black/5 rounded-sm p-5 mb-6 flex flex-col sm:flex-row gap-3 flex-wrap">
        <input placeholder="CODE" value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })} required
          className="border border-black/10 rounded-sm px-3 py-2 text-sm flex-1 min-w-[120px]" />
        <input type="number" placeholder="Discount %" value={form.discountPercent}
          onChange={(e) => setForm({ ...form, discountPercent: e.target.value })} required
          className="border border-black/10 rounded-sm px-3 py-2 text-sm w-32" />
        <input type="date" value={form.expiresAt}
          onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} required
          className="border border-black/10 rounded-sm px-3 py-2 text-sm" />
        <button className="bg-sage text-ivory text-sm px-5 py-2 rounded-sm hover:bg-sage-dark">Add Coupon</button>
      </form>

      {error && <p className="text-sm text-plum mb-4">{error}</p>}

      <div className="bg-white border border-black/5 rounded-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[400px]">
          <thead>
            <tr className="text-left border-b border-black/5 text-muted">
              <th className="p-3">Code</th>
              <th className="p-3">Discount</th>
              <th className="p-3">Expires</th>
              <th className="p-3">Active</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c._id} className="border-b border-black/5">
                <td className="p-3 font-medium">{c.code}</td>
                <td className="p-3">{c.discountPercent}%</td>
                <td className="p-3">{new Date(c.expiresAt).toLocaleDateString()}</td>
                <td className="p-3">{c.isActive ? 'Yes' : 'No'}</td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr><td colSpan="4" className="p-4 text-center text-muted">No coupons yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}

export default Coupons
