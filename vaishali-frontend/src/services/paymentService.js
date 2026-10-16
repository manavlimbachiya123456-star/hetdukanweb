import api from './api.js'

export const createRazorpayOrder = (orderId) => api.post('/payment/create-order', { orderId })
export const verifyPayment = (payload) => api.post('/payment/verify', payload)

export const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
