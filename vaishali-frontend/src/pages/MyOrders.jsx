import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMyOrders } from '../services/orderService.js'

const STATUS_STYLES = {
  placed: 'bg-stone text-ink',
  shipped: 'bg-sage/15 text-sage-dark',
  delivered: 'bg-sage text-ivory',
  cancelled: 'bg-plum/10 text-plum',
}

function MyOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyOrders()
      .then(({ data }) => setOrders(data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="px-4 py-16 text-center text-muted">Loading...</div>

  if (orders.length === 0) {
    return (
      <div className="px-4 py-20 text-center">
        <p className="font-serif text-2xl text-sage-dark mb-3">No orders yet</p>
        <Link to="/shop" className="text-sage underline text-sm">Start shopping</Link>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 md:px-10 py-8 md:py-12 max-w-3xl mx-auto">
      <h1 className="font-serif text-3xl md:text-4xl text-sage-dark mb-8">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-white border border-black/5 rounded-xl2 shadow-soft p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <span className="text-xs text-muted">Order #{order._id.slice(-8).toUpperCase()}</span>
              <span className={`text-xs px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[order.orderStatus]}`}>
                {order.orderStatus}
              </span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {order.items.map((item, i) => (
                <div key={i} className="w-14 h-16 flex-shrink-0 rounded-md overflow-hidden bg-stone">
                  {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-3 text-sm">
              <span className="text-muted">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
              <span className="font-medium text-sage-dark">₹{order.totalPrice.toLocaleString('en-IN')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyOrders
