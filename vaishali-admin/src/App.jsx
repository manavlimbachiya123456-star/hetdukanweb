import { Routes, Route } from 'react-router-dom'
import { AdminAuthProvider } from './context/AdminAuthContext.jsx'
import ProtectedRoute from './components/layout/ProtectedRoute.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Products from './pages/Products.jsx'
import AddEditProduct from './pages/AddEditProduct.jsx'
import Orders from './pages/Orders.jsx'
import Reports from './pages/Reports.jsx'
import Coupons from './pages/Coupons.jsx'

function App() {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
        <Route path="/products/new" element={<ProtectedRoute><AddEditProduct /></ProtectedRoute>} />
        <Route path="/products/:id/edit" element={<ProtectedRoute><AddEditProduct /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
        <Route path="/coupons" element={<ProtectedRoute><Coupons /></ProtectedRoute>} />
      </Routes>
    </AdminAuthProvider>
  )
}

export default App
