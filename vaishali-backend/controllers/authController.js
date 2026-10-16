import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'

const payload = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  token: generateToken(user._id),
})

// @route POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' })
    }
    if (await User.findOne({ email: email.toLowerCase() })) {
      return res.status(400).json({ message: 'Email already registered' })
    }
    const user = await User.create({ name, email, phone, password })
    res.status(201).json(payload(user))
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email: (email || '').toLowerCase() })
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }
    res.json(payload(user))
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route GET /api/auth/profile
export const getProfile = async (req, res) => {
  res.json(req.user)
}
