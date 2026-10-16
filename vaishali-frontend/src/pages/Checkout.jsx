import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { createOrder, applyCoupon } from '../services/orderService.js'
import { createRazorpayOrder, verifyPayment, loadRazorpayScript } from '../services/paymentService.js'
import { getProfile, addAddress as saveAddressApi } from '../services/userService.js'

function Checkout() {
  const { items, totalPrice, clearCart } = useCart()
  const navigate = useNavigate()

  const [address, setAddress] = useState({ line1: '', line2: '', city: '', state: '', pincode: '', phone: '' })
  const [paymentMethod, setPaymentMethod] = useState('razorpay')
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState('')
  const [couponCode, setCouponCode] = useState('')
  const [couponStatus, setCouponStatus] = useState(null)
  const [checkingCoupon, setCheckingCoupon] = useState(false)
  const [savedAddresses, setSavedAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState('')
  const [saveThisAddress, setSaveThisAddress] = useState(true)

  const isLoggedIn = Boolean(localStorage.getItem('token'))

  useEffect(() => {
    if (!isLoggedIn) return
    getProfile().then(({ data }) => {
      setSavedAddresses(data.addresses || [])
      if (data.addresses?.length) {
        const first = data.addresses[0]
        setSelectedAddressId(first._id)
        setAddress({
          line1: first.line1 || '', line2: first.line2 || '', city: first.city || '',
          state: first.state || '', pincode: first.pincode || '', phone: first.phone || '',
        })
        setSaveThisAddress(false)
      }
    }).catch(() => {})
  }, [isLoggedIn])

  const handleSelectSaved = (addr) => {
    setSelectedAddressId(addr._id)
    setAddress({
      line1: addr.line1 || '', line2: addr.line2 || '', city: addr.city || '',
      state: addr.state || '', pincode: addr.pincode || '', phone: addr.phone || '',
    })
    setSaveThisAddress(false)
  }

  if (items.length === 0) {
    return (
      <div className="px-4 py-20 text-center">
        <p className="text-muted mb-4">Your cart is empty.</p>
        <Link to="/shop" className="text-sage underline text-sm">Shop sarees</Link>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="px-4 py-20 text-center max-w-sm mx-auto">
        <p className="font-serif text-2xl text-sage-dark mb-3">Please sign in to continue</p>
        <p className="text-sm text-muted mb-6">You need an account to place an order.</p>
        <Link to="/login" className="inline-block bg-sage text-ivory px-8 py-3 rounded-lg text-sm shadow-soft hover:bg-sage-dark transition-colors">
          Sign in
        </Link>
      </div>
    )
  }

  const handleChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value })

  const handleCheckCoupon = async () => {
    if (!couponCode.trim()) return
    setCheckingCoupon(true)
    setCouponStatus(null)
    try {
      const { data } = await applyCoupon(couponCode.trim())
      setCouponStatus({ discountPercent: data.discountPercent })
    } catch (err) {
      setCouponStatus({ error: err.response?.data?.message || 'Invalid coupon' })
    } finally {
      setCheckingCoupon(false)
    }
  }

  const discountPercent = couponStatus?.discountPercent || 0
  const discountAmount = Math.round((totalPrice * discountPercent) / 100)
  const finalTotal = totalPrice - discountAmount

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    setError('')
    setPlacing(true)

    try {
      const orderPayload = {
        items: items.map((i) => ({ product: i.product._id, quantity: i.quantity })),
        shippingAddress: address,
        paymentMethod,
        ...(couponStatus?.discountPercent ? { couponCode: couponCode.trim() } : {}),
      }
      const { data: order } = await createOrder(orderPayload)

      if (saveThisAddress) {
        saveAddressApi(address).catch(() => {})
      }

      if (paymentMethod === 'cod') {
        clearCart()
        navigate(`/order-success/${order._id}`)
        return
      }

      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        setError('Could not load payment gateway. Check your internet connection.')
        setPlacing(false)
        return
      }

      const { data: rpOrder } = await createRazorpayOrder(order._id)

      const rzp = new window.Razorpay({
        key: rpOrder.keyId,
        amount: rpOrder.amount,
        currency: rpOrder.currency,
        name: 'Vaishali Saree',
        description: `Order #${order._id.slice(-8)}`,
        order_id: rpOrder.razorpayOrderId,
        handler: async (response) => {
          try {
            await verifyPayment({
              orderId: order._id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })
            clearCart()
            navigate(`/order-success/${order._id}`)
          } catch {
            setError('Payment verification failed. If money was deducted, contact support with your order ID.')
          }
        },
        prefill: {
          name: JSON.parse(localStorage.getItem('user') || '{}').name,
          email: JSON.parse(localStorage.getItem('user') || '{}').email,
          contact: address.phone,
        },
        theme: { color: '#3f4a3a' },
        modal: { ondismiss: () => setPlacing(false) },
      })

      rzp.on('payment.failed', () => {
        setError('Payment failed. Please try again.')
        setPlacing(false)
      })

      rzp.open()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not place order. Please try again.')
      setPlacing(false)
    }
  }

  return (
    <div className="px-4 sm:px-6 md:px-10 py-8 md:py-12 max-w-4xl mx-auto">
      <h1 className="font-serif text-3xl md:text-4xl text-sage-dark mb-8">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <form onSubmit={handlePlaceOrder} className="md:col-span-2 space-y-5">
          <section className="bg-white border border-black/5 rounded-xl2 shadow-soft p-5 sm:p-6">
            <h2 className="font-serif text-xl text-sage-dark mb-4">Shipping Address</h2>

            {savedAddresses.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-3 mb-3">
                {savedAddresses.map((addr) => (
                  <button
                    key={addr._id}
                    type="button"
                    onClick={() => handleSelectSaved(addr)}
                    className={`flex-shrink-0 text-left px-3.5 py-2 rounded-lg border text-xs max-w-[220px] ${
                      selectedAddressId === addr._id ? 'border-sage bg-sage/5' : 'border-black/10'
                    }`}
                  >
                    <p className="font-medium">{addr.label || 'Address'}</p>
                    <p className="text-muted truncate">{addr.line1}, {addr.city}</p>
                  </button>
                ))}
              </div>
            )}

            <div className="space-y-3">
              <input name="line1" value={address.line1} onChange={handleChange} required placeholder="Address line 1"
                className="w-full border border-black/10 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage" />
              <input name="line2" value={address.line2} onChange={handleChange} placeholder="Address line 2 (optional)"
                className="w-full border border-black/10 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage" />
              <div className="grid grid-cols-2 gap-3">
                <input name="city" value={address.city} onChange={handleChange} required placeholder="City"
                  className="border border-black/10 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage" />
                <input name="state" value={address.state} onChange={handleChange} required placeholder="State"
                  className="border border-black/10 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input name="pincode" value={address.pincode} onChange={handleChange} required placeholder="Pincode"
                  className="border border-black/10 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage" />
                <input name="phone" value={address.phone} onChange={handleChange} required placeholder="Phone"
                  className="border border-black/10 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage" />
              </div>
              <label className="flex items-center gap-2 text-xs text-muted pt-1">
                <input type="checkbox" checked={saveThisAddress} onChange={(e) => setSaveThisAddress(e.target.checked)} />
                Save this address for next time
              </label>
            </div>
          </section>

          <section className="bg-white border border-black/5 rounded-xl2 shadow-soft p-5 sm:p-6">
            <h2 className="font-serif text-xl text-sage-dark mb-4">Payment Method</h2>
            <div className="space-y-2">
              <label className="flex items-center gap-3 border border-black/10 rounded-lg px-4 py-3 cursor-pointer has-[:checked]:border-sage has-[:checked]:bg-sage/5">
                <input type="radio" name="paymentMethod" value="razorpay" checked={paymentMethod === 'razorpay'}
                  onChange={(e) => setPaymentMethod(e.target.value)} />
                <span className="text-sm">UPI / Card / Netbanking (Razorpay)</span>
              </label>
              <label className="flex items-center gap-3 border border-black/10 rounded-lg px-4 py-3 cursor-pointer has-[:checked]:border-sage has-[:checked]:bg-sage/5">
                <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)} />
                <span className="text-sm">Cash on Delivery</span>
              </label>
            </div>
          </section>

          {error && <p className="text-sm text-plum bg-plum/5 border border-plum/20 rounded-lg px-4 py-3">{error}</p>}

          <button type="submit" disabled={placing}
            className="w-full md:w-auto bg-sage text-ivory px-10 py-3.5 rounded-lg text-sm shadow-soft hover:bg-sage-dark hover:shadow-lift transition-all disabled:opacity-60">
            {placing ? 'Processing...' : paymentMethod === 'cod' ? 'Place Order' : 'Pay Now'}
          </button>
        </form>

        <div className="bg-white border border-black/5 rounded-xl2 shadow-soft p-5 h-fit">
          <h2 className="font-serif text-xl text-sage-dark mb-4">Order Summary</h2>
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {items.map(({ product, quantity }) => {
              const price = product.discountPrice || product.price
              return (
                <div key={product._id} className="flex justify-between text-sm">
                  <span className="truncate pr-2">{product.name} × {quantity}</span>
                  <span className="flex-shrink-0">₹{(price * quantity).toLocaleString('en-IN')}</span>
                </div>
              )
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-black/5">
            <div className="flex gap-2">
              <input
                value={couponCode}
                onChange={(e) => { setCouponCode(e.target.value); setCouponStatus(null) }}
                placeholder="Coupon code"
                className="flex-1 border border-black/10 rounded-lg px-3 py-2 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage"
              />
              <button type="button" onClick={handleCheckCoupon} disabled={checkingCoupon}
                className="text-sm px-4 border border-black/10 rounded-lg hover:bg-stone/40 transition-colors disabled:opacity-60">
                {checkingCoupon ? '...' : 'Apply'}
              </button>
            </div>
            {couponStatus?.discountPercent && (
              <p className="text-xs text-sage-dark mt-2">✓ {couponStatus.discountPercent}% off applied</p>
            )}
            {couponStatus?.error && (
              <p className="text-xs text-plum mt-2">{couponStatus.error}</p>
            )}
          </div>

          <div className="border-t border-black/5 mt-4 pt-4 space-y-1">
            <div className="flex justify-between text-sm text-muted">
              <span>Subtotal</span>
              <span>₹{totalPrice.toLocaleString('en-IN')}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-sm text-sage-dark">
                <span>Discount</span>
                <span>−₹{discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between font-medium pt-1">
              <span>Total</span>
              <span className="text-sage-dark">₹{finalTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
