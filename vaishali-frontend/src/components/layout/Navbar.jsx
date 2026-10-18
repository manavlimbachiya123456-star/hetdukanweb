import { useState } from 'react'
import { Link} from 'react-router-dom'
import { useCart } from '../../context/CartContext.jsx'

const NAV_LINKS = [
  { label: 'All Sarees', href: '/shop' },
  { label: 'New Arrivals', href: '/shop?sort=newest' },
  { label: 'Premium Collection', href: '/shop?category=bridal' },
  { label: 'Silk', href: '/shop?category=silk' },
  { label: 'Cotton', href: '/shop?category=cotton' },
  { label: 'Linen', href: '/shop?category=linen' },
]

function Navbar() {
  const [open, setOpen] = useState(false)
 
  const { totalItems } = useCart()

  const user = (() => {
    try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
  })()



  return (
    <nav className="bg-ivory border-b border-black/5 relative z-40">
      <div className="flex items-center justify-between px-4 sm:px-6 md:px-10 py-3 md:py-4">
        <Link to="/" className="font-script text-sage text-4xl md:text-5xl leading-none">
          Vaishali
        </Link>

        <div className="hidden lg:flex gap-8 text-[0.95rem]">
          {NAV_LINKS.map((link) => (
            <Link key={link.label} to={link.href} className="hover:text-plum transition-colors">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4 md:gap-6 text-lg">
         
          <Link to={user ? '/account' : '/login'} aria-label="Account" className="hover:text-plum">
            👤
          </Link>
          <Link to="/cart" aria-label="Cart" className="relative hover:text-plum">
            🛍
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-plum text-ivory text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          <button aria-label="Menu" className="lg:hidden text-xl" onClick={() => setOpen(!open)}>
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>

     

      {open && (
        <div className="lg:hidden flex flex-col bg-ivory border-t border-black/5 px-6 py-4 gap-4">
          {NAV_LINKS.map((link) => (
            <Link key={link.label} to={link.href} onClick={() => setOpen(false)} className="text-base py-1">
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}

export default Navbar
