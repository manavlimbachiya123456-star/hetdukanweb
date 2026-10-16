import User from '../models/User.js'

// @route PUT /api/users/profile
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    if (req.body.password) user.password = req.body.password

    const updated = await user.save()
    res.json({ _id: updated._id, name: updated.name, email: updated.email })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route POST /api/users/address
export const addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    user.addresses.push(req.body)
    await user.save()
    res.status(201).json(user.addresses)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route POST /api/users/wishlist/:productId
export const toggleWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    const { productId } = req.params
    const exists = user.wishlist.some((id) => id.toString() === productId)

    if (exists) {
      user.wishlist = user.wishlist.filter((id) => id.toString() !== productId)
    } else {
      user.wishlist.push(productId)
    }

    await user.save()
    res.json(user.wishlist)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
