import api from './api.js'

export const getProductReviews = (productId) => api.get(`/reviews/${productId}`)
export const addReview = (productId, data) => api.post(`/reviews/${productId}`, data)
