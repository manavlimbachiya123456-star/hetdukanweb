import { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api.js'
import { toggleWishlist as toggleWishlistApi } from '../services/productService.js'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem('token')))

  const loadWishlist = () => {
    const loggedIn = Boolean(localStorage.getItem('token'))
    setIsLoggedIn(loggedIn)
    if (!loggedIn) {
      setWishlist([])
      return
    }
    api.get('/auth/profile')
      .then(({ data }) => setWishlist(data.wishlist || []))
      .catch(() => setWishlist([]))
  }

  useEffect(() => {
    loadWishlist()
    window.addEventListener('auth-changed', loadWishlist)
    return () => window.removeEventListener('auth-changed', loadWishlist)
  }, [])

  const toggle = async (productId) => {
    if (!isLoggedIn) return false
    const { data } = await toggleWishlistApi(productId)
    setWishlist(data)
    return true
  }

  const isWishlisted = (productId) => wishlist.includes(productId)

  return (
    <WishlistContext.Provider value={{ wishlist, toggle, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)
