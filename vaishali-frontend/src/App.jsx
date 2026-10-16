import { Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext.jsx'
import { WishlistProvider } from './context/WishlistContext.jsx'
import TopStrip from './components/layout/TopStrip.jsx'
import Navbar from './components/layout/Navbar.jsx'
import Footer from './components/layout/Footer.jsx'
import Home from './pages/Home.jsx'
import Shop from './pages/Shop.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Account from './pages/Account.jsx'
import OrderSuccess from './pages/OrderSuccess.jsx'
import MyOrders from './pages/MyOrders.jsx'
import Wishlist from './pages/Wishlist.jsx'

function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <div className="min-h-screen flex flex-col">
          <TopStrip />
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success/:id" element={<OrderSuccess />} />
              <Route path="/orders" element={<MyOrders />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/account" element={<Account />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </WishlistProvider>
    </CartProvider>
  )
}

export default App
