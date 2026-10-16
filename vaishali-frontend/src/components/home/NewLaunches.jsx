import { useEffect, useState } from 'react'
import ProductCard from '../product/ProductCard.jsx'
import ProductCardSkeleton from '../product/ProductCardSkeleton.jsx'
import { getFeaturedProducts } from '../../services/productService.js'

function NewLaunches() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    getFeaturedProducts()
      .then(({ data }) => {
        if (!cancelled) setProducts(data.slice(0, 8))
      })
      .catch(() => {
        if (!cancelled) setError('Could not load products right now.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [])

  return (
    <section className="px-4 sm:px-6 md:px-10 py-16 md:py-24 text-center">
      <p className="font-serif italic text-sage text-base md:text-lg mb-2">Our Most Loved Picks</p>
      <h2 className="font-serif text-3xl md:text-5xl text-ink">New Launches</h2>

      {error && <p className="mt-8 text-sm text-plum">{error}</p>}

      {!error && (
        <div className="mt-10 md:mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-left">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : products.length > 0
              ? products.map((p) => <ProductCard key={p._id} product={p} />)
              : (
                <p className="col-span-full text-sm text-muted py-10">
                  No products yet — add some from the admin panel and they'll show up here.
                </p>
              )}
        </div>
      )}
    </section>
  )
}

export default NewLaunches
