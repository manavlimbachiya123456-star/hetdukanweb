import express from 'express'
import { createCoupon, getCoupons, applyCoupon } from '../controllers/couponController.js'
import { protect } from '../middleware/authMiddleware.js'
import { isAdmin } from '../middleware/adminMiddleware.js'

const router = express.Router()

router.post('/', protect, isAdmin, createCoupon)
router.get('/', protect, isAdmin, getCoupons)
router.post('/apply', protect, applyCoupon)

export default router
