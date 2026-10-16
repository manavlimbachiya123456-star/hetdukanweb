import express from 'express'
import {
  getDashboardStats,
  getRevenueReport,
  getStockReport,
  getBestSellers,
} from '../controllers/adminController.js'
import { protect } from '../middleware/authMiddleware.js'
import { isAdmin } from '../middleware/adminMiddleware.js'

const router = express.Router()

router.use(protect, isAdmin)

router.get('/dashboard', getDashboardStats)
router.get('/reports/revenue', getRevenueReport)
router.get('/reports/stock', getStockReport)
router.get('/reports/best-sellers', getBestSellers)

export default router
