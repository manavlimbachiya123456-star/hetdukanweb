function StatsCard({ label, value, sub }) {
  return (
    <div className="bg-white border border-black/5 rounded-xl2 shadow-soft p-5 hover:shadow-card transition-shadow">
      <p className="text-xs text-muted tracking-wide uppercase">{label}</p>
      <p className="font-serif text-3xl sm:text-4xl mt-1.5 text-sage-dark">{value}</p>
      {sub && <p className="text-xs text-muted mt-1">{sub}</p>}
    </div>
  )
}

export default StatsCard
