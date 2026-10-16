import razorpayInstance from '../config/razorpay.js'
import Order from '../models/Order.js'
import { verifyPaymentSignature } from '../utils/verifyPaymentSignature.js'
import { orderConfirmationEmail } from '../utils/sendEmail.js'

// @route POST /api/payment/create-order
// Creates a Razorpay order for an EXISTING order already saved in our DB,
// using the server-computed totalPrice — never a price sent from the client.
export const createRazorpayOrder = async (req, res) => {
  try {
    if (!razorpayInstance) {
      return res.status(500).json({ message: 'Payment gateway not configured yet. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env' })
    }

    const { orderId } = req.body
    const order = await Order.findById(orderId)

    if (!order) return res.status(404).json({ message: 'Order not found' })
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    const razorpayOrder = await razorpayInstance.orders.create({
      amount: Math.round(order.totalPrice * 100), // paise
      currency: 'INR',
      receipt: order._id.toString(),
    })

    order.paymentInfo.razorpay_order_id = razorpayOrder.id
    await order.save()

    res.json({
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route POST /api/payment/verify
export const verifyPayment = async (req, res) => {
  try {
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

    const isValid = verifyPaymentSignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    })

    if (!isValid) {
      return res.status(400).json({ message: 'Payment verification failed' })
    }

    const order = await Order.findById(orderId)
    if (!order) return res.status(404).json({ message: 'Order not found' })

    order.paymentInfo.razorpay_payment_id = razorpay_payment_id
    order.paymentInfo.razorpay_signature = razorpay_signature
    order.paymentStatus = 'paid'
    await order.save()

    orderConfirmationEmail(order, req.user.email)

    res.json({ message: 'Payment verified successfully', order })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
