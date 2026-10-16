import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getProductById } from '../services/productService.js'
import { useCart } from '../context/CartContext.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'
import ReviewsSection from '../components/product/ReviewsSection.jsx'

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { isWishlisted, toggle } = useWishlist()
  const [product, setProduct] = useState(null)
  const [activeImg, setActiveImg] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [added, setAdded] = useState(false)

  useEffect(() => {
    setLoading(true)
    getProductById(id)
      .then(({ data }) => setProduct(data))
      .catch(() => setError('Product not found.'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return <div className="px-4 sm:px-6 md:px-10 py-16 text-center text-muted">Loading...</div>
  }

  if (error || !product) {
    return (
      <div className="px-4 sm:px-6 md:px-10 py-16 text-center">
        <p className="text-plum mb-4">{error || 'Product not found.'}</p>
        <Link to="/" className="text-sage underline text-sm">Back to home</Link>
      </div>
    )
  }

  const { _id, name, description, images, price, discountPrice, stock, fabric, color, category, ratingsAverage, numReviews } = product
  const displayPrice = discountPrice || price

  return (
    <div className="px-4 sm:px-6 md:px-10 py-8 md:py-14 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14">

        <div>
          <div className="aspect-[3/4] bg-stone rounded-xl2 overflow-hidden shadow-card">
            {images?.[activeImg] ? (
              <img src={images[activeImg]} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted text-sm">No image</div>
            )}
          </div>
          {images?.length > 1 && (
            <div className="flex gap-2.5 mt-3 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-16 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-colors ${
                    activeImg === i ? 'border-sage' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt={`${name} ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-muted mb-2">{category}</p>

          <div className="flex items-start justify-between gap-3">
            <h1 className="font-serif text-3xl md:text-4xl text-ink leading-tight">{name}</h1>
            <button
              onClick={async () => { const ok = await toggle(_id); if (!ok) navigate('/login') }}
              aria-label="Toggle wishlist"
              className="w-10 h-10 rounded-full bg-stone flex-shrink-0 flex items-center justify-center"
            >
              {isWishlisted?.(_id) ? '❤️' : '🤍'}
            </button>
          </div>

          {numReviews > 0 && (
            <p className="text-sm text-muted mt-1">★ {ratingsAverage?.toFixed(1)} · {numReviews} review{numReviews !== 1 ? 's' : ''}</p>
          )}

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-serif text-sage-dark">₹{displayPrice?.toLocaleString('en-IN')}</span>
            {discountPrice && discountPrice < price && (
              <span className="text-muted line-through">₹{price.toLocaleString('en-IN')}</span>
            )}
          </div>

          <p className="mt-5 text-sm text-ink/80 leading-relaxed">{description}</p>

          <div className="mt-6 space-y-2 text-sm">
            {fabric && <p><span className="text-muted">Fabric:</span> {fabric}</p>}
            {color && <p><span className="text-muted">Color:</span> {color}</p>}
            <p>
              <span className="text-muted">Availability:</span>{' '}
              {stock > 0 ? (
                <span className="text-sage-dark">In stock ({stock} left)</span>
              ) : (
                <span className="text-plum">Out of stock</span>
              )}
            </p>
          </div>

          <button
            disabled={stock === 0}
            onClick={() => {
              addItem(product, 1)
              setAdded(true)
              setTimeout(() => setAdded(false), 1500)
            }}
            className="mt-8 w-full sm:w-auto bg-sage text-ivory px-10 py-3.5 rounded-lg text-sm shadow-soft hover:bg-sage-dark hover:shadow-lift transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {stock === 0 ? 'Out of Stock' : added ? 'Added ✓' : 'Add to Cart'}
          </button>

          {added && (
            <button onClick={() => navigate('/cart')} className="block mt-3 text-sm text-sage underline">
              View Cart
            </button>
          )}

          <div className="mt-8 pt-6 border-t border-black/5 grid grid-cols-3 gap-3 text-center">
            <div><p className="text-xs text-muted">Secure Payment</p></div>
            <div><p className="text-xs text-muted">3–7 Day Delivery</p></div>
            <div><p className="text-xs text-muted">7-Day Returns</p></div>
          </div>
        </div>
      </div>

      <ReviewsSection productId={_id} ratingsAverage={ratingsAverage} numReviews={numReviews} />
    </div>
  )
}

export default ProductDetail
