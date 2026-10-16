import { useEffect, useState } from 'react'
import AdminLayout from '../components/layout/AdminLayout.jsx'
import SalesChart from '../components/dashboard/SalesChart.jsx'
import { getStockReport, getBestSellers, getRevenueReport } from '../services/adminService.js'

const downloadCSV = (rows, filename) => {
  if (!rows.length) return
  const headers = Object.keys(rows[0])
  const csv = [
    headers.join(','),
    ...rows.map((r) => headers.map((h) => `"${String(r[h] ?? '').replace(/"/g, '""')}"`).join(',')),
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function Reports() {
  const [stock, setStock] = useState([])
  const [bestSellers, setBestSellers] = useState([])
  const [revenue, setRevenue] = useState([])
  const [range, setRange] = useState({ from: '', to: '' })
  const [loading, setLoading] = useState(true)

  const loadRevenue = async () => {
    const { data } = await getRevenueReport(range.from || undefined, range.to || undefined)
    setRevenue(data)
  }

  useEffect(() => {
    Promise.all([getStockReport(), getBestSellers(), getRevenueReport()]).then(([s, b, r]) => {
      setStock(s.data)
      setBestSellers(b.data)
      setRevenue(r.data)
      setLoading(false)
    })
  }, [])

  const totalInRange = revenue.reduce((sum, d) => sum + d.revenue, 0)
  const ordersInRange = revenue.reduce((sum, d) => sum + d.orders, 0)

  return (
    <AdminLayout>
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-muted mb-1">Insights</p>
        <h1 className="font-serif text-3xl sm:text-4xl text-sage-dark">Reports</h1>
      </div>

      {loading ? (
        <p className="text-sm text-muted">Loading...</p>
      ) : (
        <div className="space-y-6">

          {/* Revenue with date range */}
          <section className="bg-white border border-black/5 rounded-xl2 shadow-soft p-5">
            <div className="flex flex-col sm:flex-row sm:items-end gap-3 mb-5">
              <div>
                <label className="block text-xs text-muted mb-1">From</label>
                <input type="date" value={range.from} onChange={(e) => setRange({ ...range, from: e.target.value })}
                  className="border border-black/10 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">To</label>
                <input type="date" value={range.to} onChange={(e) => setRange({ ...range, to: e.target.value })}
                  className="border border-black/10 rounded-lg px-3 py-2 text-sm" />
              </div>
              <button onClick={loadRevenue}
                className="bg-sage text-ivory text-sm px-5 py-2 rounded-lg hover:bg-sage-dark transition-colors">
                Apply
              </button>
              <button onClick={() => downloadCSV(revenue, 'revenue-report.csv')}
                className="text-sm px-4 py-2 border border-black/10 rounded-lg hover:bg-stone/40 transition-colors sm:ml-auto">
                Export CSV
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <p className="text-xs text-muted uppercase">Revenue in range</p>
                <p className="font-serif text-2xl text-sage-dark">₹{totalInRange.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-xs text-muted uppercase">Orders in range</p>
                <p className="font-serif text-2xl text-sage-dark">{ordersInRange}</p>
              </div>
            </div>

            <SalesChart data={revenue} />
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Best sellers */}
            <section className="bg-white border border-black/5 rounded-xl2 shadow-soft p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="font-serif text-xl text-sage-dark">Best Sellers</p>
                <button onClick={() => downloadCSV(bestSellers, 'best-sellers.csv')} className="text-xs text-sage">
                  Export
                </button>
              </div>
              <ul className="space-y-2 text-sm">
                {bestSellers.map((p) => (
                  <li key={p._id} className="flex justify-between border-b border-black/5 pb-2 last:border-0">
                    <span className="truncate pr-3">{p.name}</span>
                    <span className="text-muted flex-shrink-0">
                      {p.totalSold} sold · ₹{p.revenue.toLocaleString('en-IN')}
                    </span>
                  </li>
                ))}
                {bestSellers.length === 0 && <p className="text-muted">No sales data yet.</p>}
              </ul>
            </section>

            {/* Stock */}
            <section className="bg-white border border-black/5 rounded-xl2 shadow-soft p-5 overflow-x-auto">
              <div className="flex items-center justify-between mb-3">
                <p className="font-serif text-xl text-sage-dark">Stock Report</p>
                <button onClick={() => downloadCSV(stock, 'stock-report.csv')} className="text-xs text-sage">
                  Export
                </button>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted border-b border-black/5">
                    <th className="py-2">Product</th>
                    <th className="py-2">Category</th>
                    <th className="py-2">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {stock.map((p) => (
                    <tr key={p._id} className="border-b border-black/5 last:border-0">
                      <td className="py-2 pr-2">{p.name}</td>
                      <td className="py-2 capitalize">{p.category}</td>
                      <td className={`py-2 ${p.stock <= 5 ? 'text-plum font-medium' : ''}`}>{p.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default Reports
