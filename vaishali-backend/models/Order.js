import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  image: String,
  price: Number,
  quantity: { type: Number, required: true, default: 1 },
})

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    shippingAddress: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      pincode: String,
      phone: String,
    },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true, default: 0 },
    couponCode: String,
    discountAmount: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['razorpay', 'cod'], required: true },
    paymentInfo: {
      razorpay_order_id: String,
      razorpay_payment_id: String,
      razorpay_signature: String,
    },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    orderStatus: {
      type: String,
      enum: ['placed', 'shipped', 'delivered', 'cancelled'],
      default: 'placed',
    },
    deliveredAt: Date,
  },
  { timestamps: true }
)

export default mongoose.model('Order', orderSchema)
