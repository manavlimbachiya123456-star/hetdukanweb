import express from 'express'
import { updateProfile, addAddress, toggleWishlist } from '../controllers/userController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.put('/profile', protect, updateProfile)
router.post('/address', protect, addAddress)
router.post('/wishlist/:productId', protect, toggleWishlist)

export default router
