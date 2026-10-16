import Order from '../models/Order.js'
import Product from '../models/Product.js'
import Coupon from '../models/Coupon.js'
import { orderConfirmationEmail } from '../utils/sendEmail.js'

// @route POST /api/orders
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, couponCode } = req.body

    if (!items?.length) {
      return res.status(400).json({ message: 'No order items' })
    }

    // Recompute prices server-side — never trust the client's totals
    let itemsPrice = 0
    const verifiedItems = []

    for (const item of items) {
      const product = await Product.findById(item.product)
      if (!product) return res.status(404).json({ message: `Product ${item.product} not found` })
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `${product.name} is out of stock` })
      }
      const price = product.discountPrice || product.price
      itemsPrice += price * item.quantity
      verifiedItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0],
        price,
        quantity: item.quantity,
      })
    }

    // Validate and apply coupon server-side — never trust a client-sent discount amount
    let discountAmount = 0
    let appliedCouponCode
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true })
      if (coupon && coupon.expiresAt >= new Date()) {
        discountAmount = Math.round((itemsPrice * coupon.discountPercent) / 100)
        appliedCouponCode = coupon.code
      }
    }

    const shippingPrice = itemsPrice >= 2999 ? 0 : 99
    const totalPrice = Math.max(itemsPrice - discountAmount, 0) + shippingPrice

    const order = await Order.create({
      user: req.user._id,
      items: verifiedItems,
      shippingAddress,
      itemsPrice,
      shippingPrice,
      couponCode: appliedCouponCode,
      discountAmount,
      totalPrice,
      paymentMethod,
    })

    // Reduce stock
    for (const item of verifiedItems) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } })
    }

    if (paymentMethod === 'cod') {
      orderConfirmationEmail(order, req.user.email)
    }

    res.status(201).json(order)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route GET /api/orders/my
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route GET /api/orders/:id
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email')
    if (!order) return res.status(404).json({ message: 'Order not found' })

    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' })
    }

    res.json(order)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route GET /api/orders  (admin only)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route PUT /api/orders/:id/status  (admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body
    const order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ message: 'Order not found' })

    order.orderStatus = orderStatus
    if (orderStatus === 'delivered') order.deliveredAt = new Date()

    await order.save()
    res.json(order)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
