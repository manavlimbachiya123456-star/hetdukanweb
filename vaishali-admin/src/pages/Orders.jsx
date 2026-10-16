import { useEffect, useState } from 'react'
import AdminLayout from '../components/layout/AdminLayout.jsx'
import { getAllOrders, updateOrderStatus } from '../services/adminService.js'

const STATUSES = ['placed', 'shipped', 'delivered', 'cancelled']

const STATUS_STYLES = {
  placed: 'bg-stone text-ink',
  shipped: 'bg-sage/15 text-sage-dark',
  delivered: 'bg-sage text-ivory',
  cancelled: 'bg-plum/10 text-plum',
}

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [expanded, setExpanded] = useState(null)

  const load = async () => {
    setLoading(true)
    const { data } = await getAllOrders()
    setOrders(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleStatusChange = async (id, status) => {
    await updateOrderStatus(id, status)
    load()
  }

  const visible = filter ? orders.filter((o) => o.orderStatus === filter) : orders

  return (
    <AdminLayout>
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-muted mb-1">Fulfilment</p>
        <h1 className="font-serif text-3xl sm:text-4xl text-sage-dark">Orders</h1>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
        {[{ label: 'All', value: '' }, ...STATUSES.map((s) => ({ label: s, value: s }))].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm border capitalize transition-colors ${
              filter === f.value ? 'bg-sage text-ivory border-sage' : 'border-black/10 hover:border-sage/50 bg-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-muted">Loading...</p>
      ) : visible.length === 0 ? (
        <div className="bg-white border border-black/5 rounded-xl2 shadow-soft p-10 text-center">
          <p className="text-sm text-muted">No orders here yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((o) => (
            <div key={o._id} className="bg-white border border-black/5 rounded-xl2 shadow-soft overflow-hidden">
              <div className="p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-muted">#{o._id.slice(-8).toUpperCase()}</p>
                    <p className="text-sm font-medium mt-0.5">{o.user?.name || '—'}</p>
                    <p className="text-xs text-muted">{o.user?.email}</p>
                  </div>

                  <div className="text-right">
                    <p className="font-serif text-xl text-sage-dark">₹{o.totalPrice.toLocaleString('en-IN')}</p>
                    <p className={`text-xs mt-0.5 ${o.paymentStatus === 'paid' ? 'text-sage-dark' : 'text-muted'}`}>
                      {o.paymentMethod === 'cod' ? 'COD' : 'Online'} · {o.paymentStatus}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {o.items.map((item, i) => (
                    <div key={i} className="flex gap-3 items-center">
                      <div className="w-10 h-12 rounded bg-stone overflow-hidden flex-shrink-0">
                        {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                      </div>
                      <p className="flex-1 min-w-0 text-sm truncate">{item.name}</p>
                      <span className="text-sm font-medium bg-stone/60 rounded-full px-2.5 py-0.5 flex-shrink-0">× {item.quantity}</span>
                    </div>
                  ))}
                  <p className="text-xs text-muted">
                    {o.items.reduce((t, i) => t + i.quantity, 0)} piece(s) total
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[o.orderStatus]}`}>
                    {o.orderStatus}
                  </span>
                  <select
                    value={o.orderStatus}
                    onChange={(e) => handleStatusChange(o._id, e.target.value)}
                    className="border border-black/10 rounded-lg px-2.5 py-1.5 text-xs capitalize bg-white"
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button
                    onClick={() => setExpanded(expanded === o._id ? null : o._id)}
                    className="text-xs text-sage ml-auto"
                  >
                    {expanded === o._id ? 'Hide details' : 'View details'}
                  </button>
                </div>
              </div>

              {expanded === o._id && (
                <div className="border-t border-black/5 bg-stone/20 p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted mb-2">Items</p>
                    <div className="space-y-2">
                      {o.items.map((item, i) => (
                        <div key={i} className="flex gap-3 items-center">
                          <div className="w-10 h-12 rounded bg-stone overflow-hidden flex-shrink-0">
                            {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                          </div>
                          <div className="flex-1 min-w-0 text-sm">
                            <p className="truncate">{item.name}</p>
                            <p className="text-xs text-muted">
                              ₹{item.price.toLocaleString('en-IN')} × {item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted mb-2">Shipping Address</p>
                    <div className="text-sm space-y-0.5">
                      <p>{o.shippingAddress?.line1}</p>
                      {o.shippingAddress?.line2 && <p>{o.shippingAddress.line2}</p>}
                      <p>{o.shippingAddress?.city}, {o.shippingAddress?.state} {o.shippingAddress?.pincode}</p>
                      <p className="text-muted">{o.shippingAddress?.phone}</p>
                    </div>

                    <p className="text-xs uppercase tracking-wide text-muted mt-4 mb-1">Summary</p>
                    <div className="text-sm space-y-0.5">
                      <p className="flex justify-between">
                        <span className="text-muted">Items</span>
                        <span>₹{o.itemsPrice.toLocaleString('en-IN')}</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-muted">Shipping</span>
                        <span>{o.shippingPrice === 0 ? 'Free' : `₹${o.shippingPrice}`}</span>
                      </p>
                      <p className="flex justify-between font-medium pt-1 border-t border-black/5 mt-1">
                        <span>Total</span>
                        <span>₹{o.totalPrice.toLocaleString('en-IN')}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}

export default Orders
