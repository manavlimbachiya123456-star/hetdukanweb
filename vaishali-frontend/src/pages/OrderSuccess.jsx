import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getOrderById } from '../services/orderService.js'

function OrderSuccess() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)

  useEffect(() => {
    getOrderById(id).then(({ data }) => setOrder(data)).catch(() => {})
  }, [id])

  return (
    <div className="px-4 py-16 text-center max-w-md mx-auto">
      <div className="w-16 h-16 rounded-full bg-sage/10 flex items-center justify-center mx-auto mb-5">
        <span className="text-3xl text-sage">✓</span>
      </div>
      <p className="font-serif text-3xl text-sage-dark mb-2">Order Placed!</p>
      <p className="text-sm text-muted mb-1">Order ID: {id.slice(-8).toUpperCase()}</p>
      {order && (
        <p className="text-sm text-muted mb-6">
          {order.paymentStatus === 'paid' ? 'Payment received.' : 'Pay on delivery.'} We'll notify you once it ships.
        </p>
      )}
      <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
        <Link to="/orders" className="bg-sage text-ivory px-8 py-3 rounded-lg text-sm shadow-soft hover:bg-sage-dark transition-colors">
          View My Orders
        </Link>
        <Link to="/shop" className="border border-black/10 px-8 py-3 rounded-lg text-sm hover:bg-stone/40 transition-colors">
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}

export default OrderSuccess
