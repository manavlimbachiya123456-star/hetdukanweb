import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
})

// Attach admin token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// If token is invalid/expired, boot back to login
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
