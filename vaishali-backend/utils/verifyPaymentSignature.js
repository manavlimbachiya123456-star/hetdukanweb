import crypto from 'crypto'

// Verifies that a payment callback actually came from Razorpay and wasn't
// forged or tampered with on the client side. NEVER mark an order as paid
// without this check passing.
export const verifyPaymentSignature = ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
  const body = `${razorpay_order_id}|${razorpay_payment_id}`
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex')

  return expectedSignature === razorpay_signature
}
