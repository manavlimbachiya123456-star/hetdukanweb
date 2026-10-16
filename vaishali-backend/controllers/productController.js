import Product from '../models/Product.js'
import cloudinary from '../config/cloudinary.js'

// @route GET /api/products  (supports ?category=&search=&minPrice=&maxPrice=&sort=)
export const getProducts = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sort } = req.query
    const filter = {}

    if (category) filter.category = category
    if (search) filter.$text = { $search: search }
    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = Number(minPrice)
      if (maxPrice) filter.price.$lte = Number(maxPrice)
    }

    let query = Product.find(filter)

    if (sort === 'price_asc') query = query.sort({ price: 1 })
    else if (sort === 'price_desc') query = query.sort({ price: -1 })
    else query = query.sort({ createdAt: -1 })

    const products = await query
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route POST /api/products  (admin only)
export const createProduct = async (req, res) => {
  try {
    const imageUrls = []

    if (req.files?.length) {
      for (const file of req.files) {
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'vaishali-saree/products' },
            (error, result) => (error ? reject(error) : resolve(result))
          )
          stream.end(file.buffer)
        })
        imageUrls.push(uploadResult.secure_url)
      }
    }

    const product = await Product.create({ ...req.body, images: imageUrls })
    res.status(201).json(product)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route PUT /api/products/:id  (admin only)
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route DELETE /api/products/:id  (admin only)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json({ message: 'Product deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
