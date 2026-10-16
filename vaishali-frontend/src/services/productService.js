import api from './api.js'

export const getProducts = (params) => api.get('/products', { params })
export const getProductById = (id) => api.get(`/products/${id}`)
export const getFeaturedProducts = () => api.get('/products', { params: { sort: 'newest' } })
export const toggleWishlist = (productId) => api.post(`/users/wishlist/${productId}`)
