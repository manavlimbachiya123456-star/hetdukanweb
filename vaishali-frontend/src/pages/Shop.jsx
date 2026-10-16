import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/product/ProductCard.jsx'
import ProductCardSkeleton from '../components/product/ProductCardSkeleton.jsx'
import { getProducts } from '../services/productService.js'

const CATEGORIES = [
  { label: 'All', value: '' },
  { label: 'Silk', value: 'silk' },
  { label: 'Cotton', value: 'cotton' },
  { label: 'Linen', value: 'linen' },
  { label: 'Banarasi', value: 'banarasi' },
  { label: 'Bridal', value: 'bridal' },
  { label: 'Tissue', value: 'tissue' },
  { label: 'Mulmul', value: 'mulmul' },
]

const SORTS = [
  { label: 'Newest', value: '' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
]

function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') || ''
  const search = searchParams.get('search') || ''
  const sort = searchParams.get('sort') || ''

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    const params = {}
    if (category) params.category = category
    if (search) params.search = search
    if (sort) params.sort = sort

    getProducts(params)
      .then(({ data }) => setProducts(data))
      .catch(() => setError('Could not load products right now.'))
      .finally(() => setLoading(false))
  }, [category, search, sort])

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next)
  }

  return (
    <div className="px-4 sm:px-6 md:px-10 py-8 md:py-12 max-w-7xl mx-auto">
      <div className="text-center mb-8 md:mb-10">
        <p className="font-serif italic text-sage text-base md:text-lg mb-1">
          {search ? `Results for "${search}"` : 'Browse the Collection'}
        </p>
        <h1 className="font-serif text-3xl md:text-5xl text-ink">
          {category ? category.charAt(0).toUpperCase() + category.slice(1) + ' Sarees' : 'All Sarees'}
        </h1>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => updateParam('category', c.value)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm border transition-colors ${
              category === c.value
                ? 'bg-sage text-ivory border-sage'
                : 'border-black/10 text-ink hover:border-sage/50'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="flex justify-end mb-6">
        <select
          value={sort}
          onChange={(e) => updateParam('sort', e.target.value)}
          className="border border-black/10 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage"
        >
          {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {error && <p className="text-sm text-plum text-center py-10">{error}</p>}

      {!error && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : products.length > 0
              ? products.map((p) => <ProductCard key={p._id} product={p} />)
              : (
                <p className="col-span-full text-sm text-muted text-center py-16">
                  No sarees found{category ? ` in ${category}` : ''}.
                </p>
              )}
        </div>
      )}
    </div>
  )
}

export default Shop
