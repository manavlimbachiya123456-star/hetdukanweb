import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['silk', 'cotton', 'linen', 'banarasi', 'bridal', 'tissue', 'mulmul'],
    },
    fabric: String,
    color: String,
    price: { type: Number, required: true },
    discountPrice: Number,
    images: [{ type: String, required: true }], // Cloudinary URLs
    stock: { type: Number, required: true, default: 0 },
    withBlouse: { type: Boolean, default: true },
    ratingsAverage: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
)

productSchema.index({ name: 'text', description: 'text' })

export default mongoose.model('Product', productSchema)
