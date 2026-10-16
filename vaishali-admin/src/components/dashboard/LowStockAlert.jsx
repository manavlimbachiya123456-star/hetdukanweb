function LowStockAlert({ products }) {
  if (!products?.length) {
    return (
      <div className="bg-white border border-black/5 rounded-sm p-5">
        <p className="font-serif text-xl text-sage-dark mb-2">Low Stock</p>
        <p className="text-sm text-muted">All products are well stocked.</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-black/5 rounded-sm p-5">
      <p className="font-serif text-xl text-sage-dark mb-3">Low Stock Alerts</p>
      <ul className="space-y-2">
        {products.map((p) => (
          <li key={p._id} className="flex justify-between text-sm border-b border-black/5 pb-2">
            <span>{p.name}</span>
            <span className="text-plum font-medium">{p.stock} left</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default LowStockAlert
