import api from './api.js'

export const getProfile = () => api.get('/auth/profile')
export const addAddress = (address) => api.post('/users/address', address)
