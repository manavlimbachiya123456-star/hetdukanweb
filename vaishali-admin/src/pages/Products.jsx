import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../components/layout/AdminLayout.jsx'
import { getProducts, deleteProduct } from '../services/adminService.js'

function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const load = async () => {
    setLoading(true)
    const { data } = await getProducts(search ? { search } : {})
    setProducts(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    await deleteProduct(id)
    load()
  }

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted mb-1">Catalog</p>
          <h1 className="font-serif text-3xl sm:text-4xl text-sage-dark">Products</h1>
        </div>
        <Link
          to="/products/new"
          className="bg-sage text-ivory text-sm px-5 py-2.5 rounded-lg shadow-soft hover:bg-sage-dark hover:shadow-lift transition-all text-center"
        >
          + Add Product
        </Link>
      </div>

      <div className="flex gap-2 mb-5">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && load()}
          placeholder="Search products..."
          className="flex-1 border border-black/10 rounded-lg px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition"
        />
        <button onClick={load} className="text-sm px-5 border border-black/10 rounded-lg bg-white hover:bg-stone/40 transition-colors">
          Search
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-muted">Loading...</p>
      ) : products.length === 0 ? (
        <div className="bg-white border border-black/5 rounded-xl2 shadow-soft p-10 text-center">
          <p className="text-sm text-muted">No products found.</p>
        </div>
      ) : (
        <>
          {/* Mobile: card list */}
          <div className="grid grid-cols-1 sm:hidden gap-3">
            {products.map((p) => (
              <div key={p._id} className="bg-white border border-black/5 rounded-xl2 shadow-soft p-4 flex gap-3">
                <div className="w-16 h-20 rounded-lg overflow-hidden bg-stone flex-shrink-0">
                  {p.images?.[0] && <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-xs text-muted capitalize mt-0.5">{p.category}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-sage-dark font-medium">₹{p.price.toLocaleString('en-IN')}</span>
                    <span className={`text-xs ${p.stock <= 5 ? 'text-plum font-medium' : 'text-muted'}`}>
                      {p.stock} in stock
                    </span>
                  </div>
                  <div className="flex gap-4 mt-2">
                    <Link to={`/products/${p._id}/edit`} className="text-xs text-sage font-medium">Edit</Link>
                    <button onClick={() => handleDelete(p._id)} className="text-xs text-plum font-medium">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: table */}
          <div className="hidden sm:block bg-white border border-black/5 rounded-xl2 shadow-soft overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-black/5 text-muted">
                  <th className="p-4">Product</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-b border-black/5 last:border-0 hover:bg-stone/20 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-14 rounded-md overflow-hidden bg-stone flex-shrink-0">
                          {p.images?.[0] && <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />}
                        </div>
                        <span>{p.name}</span>
                      </div>
                    </td>
                    <td className="p-4 capitalize">{p.category}</td>
                    <td className="p-4">₹{p.price.toLocaleString('en-IN')}</td>
                    <td className={`p-4 ${p.stock <= 5 ? 'text-plum font-medium' : ''}`}>{p.stock}</td>
                    <td className="p-4 flex gap-3">
                      <Link to={`/products/${p._id}/edit`} className="text-sage hover:underline">Edit</Link>
                      <button onClick={() => handleDelete(p._id)} className="text-plum hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </AdminLayout>
  )
}

export default Products
