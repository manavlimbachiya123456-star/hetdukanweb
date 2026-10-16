import api from './api.js'

export const login = (email, password) => api.post('/auth/login', { email, password })

export const getDashboardStats = () => api.get('/admin/dashboard')
export const getRevenueReport = (from, to) => api.get('/admin/reports/revenue', { params: { from, to } })
export const getStockReport = () => api.get('/admin/reports/stock')
export const getBestSellers = () => api.get('/admin/reports/best-sellers')

export const getProducts = (params) => api.get('/products', { params })
export const getProductById = (id) => api.get(`/products/${id}`)
export const createProduct = (formData) =>
  api.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const updateProduct = (id, data) => api.put(`/products/${id}`, data)
export const deleteProduct = (id) => api.delete(`/products/${id}`)

export const getAllOrders = () => api.get('/orders')
export const getOrderById = (id) => api.get(`/orders/${id}`)
export const updateOrderStatus = (id, orderStatus) => api.put(`/orders/${id}/status`, { orderStatus })

export const getCoupons = () => api.get('/coupons')
export const createCoupon = (data) => api.post('/coupons', data)
