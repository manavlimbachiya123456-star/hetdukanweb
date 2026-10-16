const ITEMS = [
  { title: 'Secure Payments', sub: 'UPI · Cards · COD' },
  { title: 'Pan-India Delivery', sub: '3–7 business days' },
  { title: 'Easy Returns', sub: '7-day window' },
  { title: 'Authentic Weaves', sub: 'Certified handloom' },
]

function TrustStrip() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 bg-sage-dark text-stone text-center">
      {ITEMS.map((item, i) => (
        <div
          key={item.title}
          className={`py-7 md:py-9 px-3 ${i % 2 === 0 ? 'border-r border-white/10' : ''} md:border-r md:last:border-r-0`}
        >
          <p className="font-serif italic text-ivory text-base md:text-lg">{item.title}</p>
          <p className="text-[11px] md:text-xs mt-1.5 opacity-80">{item.sub}</p>
        </div>
      ))}
    </div>
  )
}

export default TrustStrip
