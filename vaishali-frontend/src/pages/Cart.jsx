import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

function Cart() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="px-4 py-20 text-center max-w-lg mx-auto">
        <p className="font-serif text-2xl text-sage-dark mb-3">Your cart is empty</p>
        <p className="text-sm text-muted mb-6">Explore the collection and find something you love.</p>
        <Link to="/shop" className="inline-block bg-sage text-ivory px-8 py-3 rounded-lg text-sm shadow-soft hover:bg-sage-dark transition-colors">
          Shop Sarees
        </Link>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 md:px-10 py-8 md:py-12 max-w-4xl mx-auto">
      <h1 className="font-serif text-3xl md:text-4xl text-sage-dark mb-8">Your Cart</h1>

      <div className="space-y-4">
        {items.map(({ product, quantity }) => {
          const price = product.discountPrice || product.price
          return (
            <div key={product._id} className="flex gap-4 bg-white border border-black/5 rounded-xl2 shadow-soft p-4">
              <div className="w-20 h-24 sm:w-24 sm:h-28 bg-stone rounded-lg overflow-hidden flex-shrink-0">
                {product.images?.[0] && <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm sm:text-base font-medium truncate">{product.name}</p>
                <p className="text-sm text-sage-dark mt-1">₹{price.toLocaleString('en-IN')}</p>

                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center border border-black/10 rounded-lg">
                    <button onClick={() => updateQuantity(product._id, quantity - 1)} className="px-3 py-1 text-sm">−</button>
                    <span className="px-3 text-sm">{quantity}</span>
                    <button onClick={() => updateQuantity(product._id, quantity + 1)} className="px-3 py-1 text-sm">+</button>
                  </div>
                  <button onClick={() => removeItem(product._id)} className="text-xs text-plum">Remove</button>
                </div>
              </div>
              <p className="text-sm font-medium self-start">₹{(price * quantity).toLocaleString('en-IN')}</p>
            </div>
          )
        })}
      </div>

      <div className="mt-8 bg-white border border-black/5 rounded-xl2 shadow-soft p-5 flex items-center justify-between">
        <span className="font-serif text-xl text-sage-dark">Total</span>
        <span className="font-serif text-2xl text-sage-dark">₹{totalPrice.toLocaleString('en-IN')}</span>
      </div>

      <button
        onClick={() => navigate('/checkout')}
        className="mt-6 w-full sm:w-auto bg-sage text-ivory px-10 py-3.5 rounded-lg text-sm shadow-soft hover:bg-sage-dark hover:shadow-lift transition-all"
      >
        Proceed to Checkout
      </button>
    </div>
  )
}

export default Cart
