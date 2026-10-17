function Footer() {
  return (
    <footer className="bg-ink text-[#b8b09c] px-4 sm:px-6 md:px-10 pt-12 pb-7">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 pb-8 border-b border-white/10">
        <div className="col-span-2 md:col-span-1">
          <div className="font-script text-ivory text-3xl md:text-4xl">Vaishali</div>
          <p className="mt-3 text-sm max-w-xs">
            Sarees that carry a story — handwoven, hand-picked, hand-delivered.
          </p>
        </div>
        <div>
          <h4 className="text-ivory text-sm mb-3 tracking-wide">Shop</h4>
          <a href="#" className="block text-sm mb-2">All Sarees</a>
          <a href="#" className="block text-sm mb-2">New Arrivals</a>
          <a href="#" className="block text-sm mb-2">Premium Collection</a>
        </div>
        <div>
          <h4 className="text-ivory text-sm mb-3 tracking-wide">Help</h4>
          <a href="#" className="block text-sm mb-2">Track Order</a>
          <a href="#" className="block text-sm mb-2">Returns & Exchange</a>
          <a href="#" className="block text-sm mb-2">Contact Us</a>
        </div>
        <div>
          <h4 className="text-ivory text-sm mb-3 tracking-wide">Stay in Touch</h4>
          <p className="text-sm">New weaves, twice a month.</p>
        </div>
      </div>
      <div className="pt-5 flex flex-col sm:flex-row justify-between gap-2 text-xs">
        <span>© 2026 Vaishali Saree</span>
        <span>MADE BY MGL SOLUTIONS</span>
      </div>
    </footer>
  )
}

export default Footer
