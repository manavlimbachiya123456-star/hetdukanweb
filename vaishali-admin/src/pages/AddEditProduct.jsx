import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../components/layout/AdminLayout.jsx'
import ImageDropzone from '../components/products/ImageDropzone.jsx'
import { createProduct, updateProduct, getProductById } from '../services/adminService.js'

const CATEGORIES = ['silk', 'cotton', 'linen', 'banarasi', 'bridal', 'tissue', 'mulmul']

function AddEditProduct() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '', description: '', category: 'silk', fabric: '', color: '',
    price: '', discountPrice: '', stock: '',
  })
  const [images, setImages] = useState([]) // File objects (new) or URL strings (existing, edit mode)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) {
      getProductById(id).then(({ data }) => {
        setForm({
          name: data.name, description: data.description, category: data.category,
          fabric: data.fabric || '', color: data.color || '',
          price: data.price, discountPrice: data.discountPrice || '', stock: data.stock,
        })
        setImages(data.images || [])
      })
    }
  }, [id])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (isEdit) {
        await updateProduct(id, form)
      } else {
        const fd = new FormData()
        Object.entries(form).forEach(([k, v]) => fd.append(k, v))
        images.forEach((img) => fd.append('images', img))
        await createProduct(fd)
      }
      navigate('/products')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto pb-24 md:pb-6">
        <div className="mb-6 sm:mb-8">
          <p className="text-xs uppercase tracking-widest text-muted mb-1">
            {isEdit ? 'Editing product' : 'New product'}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-sage-dark">
            {isEdit ? 'Edit Product' : 'Add Product'}
          </h1>
        </div>

        {error && (
          <p className="text-sm text-plum bg-plum/5 border border-plum/20 rounded-lg px-4 py-3 mb-5">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Photos */}
          <section className="bg-white border border-black/5 rounded-xl2 shadow-soft p-5 sm:p-6">
            <h2 className="font-serif text-xl text-sage-dark mb-1">Photos</h2>
            <p className="text-xs text-muted mb-4">The first photo becomes the cover image.</p>
            <ImageDropzone images={images} onChange={setImages} />
          </section>

          {/* Basic details */}
          <section className="bg-white border border-black/5 rounded-xl2 shadow-soft p-5 sm:p-6 space-y-4">
            <h2 className="font-serif text-xl text-sage-dark">Details</h2>

            <div>
              <label className="block text-sm mb-1.5 text-ink/80">Name</label>
              <input name="name" value={form.name} onChange={handleChange} required
                placeholder="e.g. Rani Gulabi Maheshwari Cotton Silk"
                className="w-full border border-black/10 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition" />
            </div>

            <div>
              <label className="block text-sm mb-1.5 text-ink/80">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} required rows={3}
                placeholder="Fabric feel, drape, occasion, care notes..."
                className="w-full border border-black/10 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition resize-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1.5 text-ink/80">Category</label>
                <select name="category" value={form.category} onChange={handleChange}
                  className="w-full border border-black/10 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition capitalize">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1.5 text-ink/80">Fabric</label>
                <input name="fabric" value={form.fabric} onChange={handleChange}
                  placeholder="e.g. Kanjivaram silk"
                  className="w-full border border-black/10 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition" />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1.5 text-ink/80">Color</label>
              <input name="color" value={form.color} onChange={handleChange}
                placeholder="e.g. Maroon"
                className="w-full border border-black/10 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition" />
            </div>
          </section>

          {/* Pricing & stock */}
          <section className="bg-white border border-black/5 rounded-xl2 shadow-soft p-5 sm:p-6">
            <h2 className="font-serif text-xl text-sage-dark mb-4">Pricing & Stock</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm mb-1.5 text-ink/80">Price (₹)</label>
                <input type="number" name="price" value={form.price} onChange={handleChange} required
                  className="w-full border border-black/10 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition" />
              </div>
              <div>
                <label className="block text-sm mb-1.5 text-ink/80">Discount Price</label>
                <input type="number" name="discountPrice" value={form.discountPrice} onChange={handleChange}
                  className="w-full border border-black/10 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition" />
              </div>
              <div>
                <label className="block text-sm mb-1.5 text-ink/80">Stock</label>
                <input type="number" name="stock" value={form.stock} onChange={handleChange} required
                  className="w-full border border-black/10 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition" />
              </div>
            </div>
          </section>

          {/* Desktop save button (mobile uses sticky bar below) */}
          <div className="hidden md:block">
            <button type="submit" disabled={saving}
              className="bg-sage text-ivory text-sm px-7 py-3 rounded-lg shadow-soft hover:bg-sage-dark hover:shadow-lift transition-all disabled:opacity-60">
              {saving ? 'Saving...' : 'Save Product'}
            </button>
          </div>

          {/* Mobile sticky save bar */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-ivory/95 backdrop-blur border-t border-black/10 p-4 z-30">
            <button type="submit" disabled={saving}
              className="w-full bg-sage text-ivory text-sm py-3.5 rounded-lg shadow-lift hover:bg-sage-dark transition-colors disabled:opacity-60">
              {saving ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}

export default AddEditProduct
