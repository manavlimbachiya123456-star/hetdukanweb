import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function SalesChart({ data }) {
  return (
    <div className="bg-white border border-black/5 rounded-xl2 shadow-soft p-5">
      <p className="font-serif text-xl text-sage-dark mb-4">Revenue (last period)</p>
      <div className="h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e9e2d3" />
            <XAxis dataKey="_id" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#3f4a3a" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default SalesChart
