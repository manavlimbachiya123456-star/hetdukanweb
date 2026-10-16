import Order from '../models/Order.js'
import Product from '../models/Product.js'
import User from '../models/User.js'

// @route GET /api/admin/dashboard
export const getDashboardStats = async (req, res) => {
  try {
    const totalRevenueAgg = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ])

    const totalOrders = await Order.countDocuments()
    const totalCustomers = await User.countDocuments({ role: 'user' })
    const lowStockProducts = await Product.find({ stock: { $lte: 5 } }).select('name stock')

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const ordersToday = await Order.countDocuments({ createdAt: { $gte: today } })

    res.json({
      totalRevenue: totalRevenueAgg[0]?.total || 0,
      totalOrders,
      ordersToday,
      totalCustomers,
      lowStockProducts,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route GET /api/admin/reports/revenue?from=&to=
export const getRevenueReport = async (req, res) => {
  try {
    const { from, to } = req.query
    const match = { paymentStatus: 'paid' }

    if (from || to) {
      match.createdAt = {}
      if (from) match.createdAt.$gte = new Date(from)
      if (to) match.createdAt.$lte = new Date(to)
    }

    const dailyRevenue = await Order.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$totalPrice' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])

    res.json(dailyRevenue)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route GET /api/admin/reports/stock
export const getStockReport = async (req, res) => {
  try {
    const products = await Product.find().select('name category stock price').sort({ stock: 1 })
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route GET /api/admin/reports/best-sellers
export const getBestSellers = async (req, res) => {
  try {
    const bestSellers = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          name: { $first: '$items.name' },
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
    ])
    res.json(bestSellers)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
