import Coupon from '../models/Coupon.js'

// @route POST /api/coupons  (admin only)
export const createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body)
    res.status(201).json(coupon)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route GET /api/coupons  (admin only)
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 })
    res.json(coupons)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route POST /api/coupons/apply
export const applyCoupon = async (req, res) => {
  try {
    const { code } = req.body
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true })

    if (!coupon || coupon.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired coupon' })
    }

    res.json({ discountPercent: coupon.discountPercent })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
