import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connectDB from './config/db.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import userRoutes from './routes/userRoutes.js'
import reviewRoutes from './routes/reviewRoutes.js'
import couponRoutes from './routes/couponRoutes.js'
import adminRoutes from './routes/adminRoutes.js'

connectDB()

const app = express()

app.use(
  cors({
    origin: [process.env.CLIENT_URL, process.env.ADMIN_URL].filter(Boolean),
    credentials: true,
  })
)
app.use(express.json())

app.get('/', (req, res) => res.send('Vaishali Saree API is running'))

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/users', userRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/coupons', couponRoutes)
app.use('/api/admin', adminRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
