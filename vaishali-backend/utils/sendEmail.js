import nodemailer from 'nodemailer'

let transporter = null

if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
} else {
  console.warn('SMTP not configured — order confirmation emails will not be sent until SMTP_HOST/SMTP_USER/SMTP_PASS are added to .env')
}

export const sendEmail = async ({ to, subject, html }) => {
  if (!transporter) return
  try {
    await transporter.sendMail({
      from: `"Vaishali Saree" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    })
  } catch (error) {
    // Never let an email failure break the order flow
    console.error('Email send failed:', error.message)
  }
}

export const orderConfirmationEmail = (order, userEmail) => {
  const itemsHtml = order.items
    .map((i) => `<tr><td style="padding:6px 0;">${i.name} × ${i.quantity}</td><td style="text-align:right;">₹${(i.price * i.quantity).toLocaleString('en-IN')}</td></tr>`)
    .join('')

  return sendEmail({
    to: userEmail,
    subject: `Order Confirmed — #${order._id.toString().slice(-8).toUpperCase()}`,
    html: `
      <div style="font-family:sans-serif; max-width:480px; margin:auto;">
        <h2 style="color:#3f4a3a;">Thank you for your order!</h2>
        <p>Order ID: <strong>#${order._id.toString().slice(-8).toUpperCase()}</strong></p>
        <table style="width:100%; border-collapse:collapse; margin:16px 0;">${itemsHtml}</table>
        <p><strong>Total: ₹${order.totalPrice.toLocaleString('en-IN')}</strong></p>
        <p style="color:#8c8471; font-size:13px;">
          Payment: ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid online'}<br/>
          We'll notify you again once your order ships.
        </p>
      </div>
    `,
  })
}
