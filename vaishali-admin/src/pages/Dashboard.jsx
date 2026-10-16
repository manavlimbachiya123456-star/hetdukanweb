import { useEffect, useState } from 'react'
import AdminLayout from '../components/layout/AdminLayout.jsx'
import StatsCard from '../components/dashboard/StatsCard.jsx'
import SalesChart from '../components/dashboard/SalesChart.jsx'
import LowStockAlert from '../components/dashboard/LowStockAlert.jsx'
import { getDashboardStats, getRevenueReport } from '../services/adminService.js'

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [revenue, setRevenue] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, revenueRes] = await Promise.all([
          getDashboardStats(),
          getRevenueReport(),
        ])
        setStats(statsRes.data)
        setRevenue(revenueRes.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <AdminLayout>
      <h1 className="font-serif text-3xl mb-6 text-sage-dark">Dashboard</h1>

      {loading && <p className="text-sm text-muted">Loading...</p>}
      {error && <p className="text-sm text-plum">{error}</p>}

      {stats && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatsCard label="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString('en-IN')}`} />
            <StatsCard label="Total Orders" value={stats.totalOrders} />
            <StatsCard label="Orders Today" value={stats.ordersToday} />
            <StatsCard label="Customers" value={stats.totalCustomers} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <SalesChart data={revenue} />
            </div>
            <LowStockAlert products={stats.lowStockProducts} />
          </div>
        </>
      )}
    </AdminLayout>
  )
}

export default Dashboard
