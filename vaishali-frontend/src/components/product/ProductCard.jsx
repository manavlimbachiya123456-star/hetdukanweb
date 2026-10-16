import { Link, useNavigate } from 'react-router-dom'
import { useWishlist } from '../../context/WishlistContext.jsx'

function ProductCard({ product }) {
  const { _id, name, images, price, discountPrice } = product
  const cover = images?.[0]
  const displayPrice = discountPrice || price
  const { isWishlisted, toggle } = useWishlist()
  const navigate = useNavigate()

  const handleWishlist = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    const ok = await toggle(_id)
    if (!ok) navigate('/login')
  }

  return (
    <Link to={`/product/${_id}`} className="block group">
      <div className="aspect-[3/4.2] bg-stone overflow-hidden rounded-lg shadow-soft group-hover:shadow-card transition-shadow relative">
        {cover ? (
          <img
            src={cover}
            alt={name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted text-xs">No image</div>
        )}
        {discountPrice && discountPrice < price && (
          <span className="absolute top-2.5 left-2.5 bg-plum text-ivory text-[10px] tracking-wide px-2 py-1 rounded-sm">
            SALE
          </span>
        )}
        <button
          onClick={handleWishlist}
          aria-label="Toggle wishlist"
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-ivory/90 flex items-center justify-center text-sm"
        >
          {isWishlisted?.(_id) ? '❤️' : '🤍'}
        </button>
      </div>
      <div className="pt-3 px-0.5">
        <p className="text-sm sm:text-[0.95rem] text-ink truncate">{name}</p>
        <p className="mt-1.5 text-sm sm:text-[0.9rem] text-sage-dark font-medium">
          ₹{displayPrice?.toLocaleString('en-IN')}
          {discountPrice && discountPrice < price && (
            <span className="ml-2 text-muted line-through font-normal">₹{price.toLocaleString('en-IN')}</span>
          )}
        </p>
      </div>
    </Link>
  )
}

export default ProductCard
