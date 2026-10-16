import api from './api.js'

export const createOrder = (orderData) => api.post('/orders', orderData)
export const getMyOrders = () => api.get('/orders/my')
export const getOrderById = (id) => api.get(`/orders/${id}`)
export const applyCoupon = (code) => api.post('/coupons/apply', { code })
