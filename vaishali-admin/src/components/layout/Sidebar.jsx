import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext.jsx'

const LINKS = [
  { to: '/', label: 'Dashboard', icon: '◈' },
  { to: '/products', label: 'Products', icon: '🧵' },
  { to: '/orders', label: 'Orders', icon: '📦' },
  { to: '/reports', label: 'Reports', icon: '📊' },
  { to: '/coupons', label: 'Coupons', icon: '🏷' },
]

function Sidebar() {
  const [open, setOpen] = useState(false)
  const { logout, admin } = useAdminAuth()

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between bg-sage-dark text-ivory px-4 py-3">
        <span className="font-script text-3xl">Vaishali</span>
        <button onClick={() => setOpen(!open)} className="text-xl">{open ? '✕' : '☰'}</button>
      </div>

      <aside
        className={`
          bg-sage-dark text-stone w-64 flex-shrink-0
          md:flex md:flex-col md:min-h-screen
          ${open ? 'flex flex-col' : 'hidden'} md:relative
        `}
      >
        <div className="hidden md:block px-6 py-6 border-b border-white/10">
          <span className="font-script text-4xl text-ivory">Vaishali</span>
          <p className="text-xs mt-1 opacity-70">Admin Panel</p>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-sm text-sm transition-colors ${
                  isActive ? 'bg-ivory text-sage-dark font-medium' : 'hover:bg-white/5'
                }`
              }
            >
              <span>{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-white/10">
          <p className="text-xs opacity-70 mb-2 truncate">{admin?.email}</p>
          <button
            onClick={logout}
            className="text-sm w-full text-left px-4 py-2 rounded-sm hover:bg-white/5"
          >
            Log out
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
