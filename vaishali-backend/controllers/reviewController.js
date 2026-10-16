import Review from '../models/Review.js'
import Product from '../models/Product.js'

// @route POST /api/reviews/:productId
export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body
    const { productId } = req.params

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      rating,
      comment,
    })

    const reviews = await Review.find({ product: productId })
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: avg,
      numReviews: reviews.length,
    })

    res.status(201).json(review)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route GET /api/reviews/:productId
export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name')
    res.json(reviews)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
