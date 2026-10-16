import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext.jsx'
import { getProductById } from '../services/productService.js'
import ProductCard from '../components/product/ProductCard.jsx'

function Wishlist() {
  const { wishlist } = useWishlist()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!wishlist || wishlist.length === 0) {
      setProducts([])
      setLoading(false)
      return
    }
    Promise.all(wishlist.map((id) => getProductById(id).then((r) => r.data).catch(() => null)))
      .then((results) => setProducts(results.filter(Boolean)))
      .finally(() => setLoading(false))
  }, [wishlist])

  if (loading) return <div className="px-4 py-16 text-center text-muted">Loading...</div>

  if (products.length === 0) {
    return (
      <div className="px-4 py-20 text-center">
        <p className="font-serif text-2xl text-sage-dark mb-3">Your wishlist is empty</p>
        <Link to="/shop" className="text-sage underline text-sm">Browse sarees</Link>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 md:px-10 py-8 md:py-12 max-w-7xl mx-auto">
      <h1 className="font-serif text-3xl md:text-4xl text-sage-dark mb-8">Your Wishlist</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map((p) => <ProductCard key={p._id} product={p} />)}
      </div>
    </div>
  )
}

export default Wishlist
