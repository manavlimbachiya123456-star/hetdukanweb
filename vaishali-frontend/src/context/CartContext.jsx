import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null)

const getCartKey = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'))
    return user?._id ? `cart_${user._id}` : 'cart_guest'
  } catch {
    return 'cart_guest'
  }
}

export function CartProvider({ children }) {
  const [cartKey, setCartKey] = useState(getCartKey())
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem(cartKey)
    return stored ? JSON.parse(stored) : []
  })

  useEffect(() => {
    const handleAuthChange = () => {
      const newKey = getCartKey()
      setCartKey(newKey)
      const stored = localStorage.getItem(newKey)
      setItems(stored ? JSON.parse(stored) : [])
    }
    window.addEventListener('auth-changed', handleAuthChange)
    return () => window.removeEventListener('auth-changed', handleAuthChange)
  }, [])

  useEffect(() => {
    localStorage.setItem(cartKey, JSON.stringify(items))
  }, [items, cartKey])

  const addItem = (product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product._id === product._id)
      if (existing) {
        return prev.map((i) =>
          i.product._id === product._id ? { ...i, quantity: i.quantity + quantity } : i
        )
      }
      return [...prev, { product, quantity }]
    })
  }

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((i) => i.product._id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    setItems((prev) =>
      prev.map((i) => (i.product._id === productId ? { ...i, quantity: Math.max(1, quantity) } : i))
    )
  }

  const clearCart = () => setItems([])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = items.reduce((sum, i) => {
    const price = i.product.discountPrice || i.product.price
    return sum + price * i.quantity
  }, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
