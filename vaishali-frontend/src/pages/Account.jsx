import { useNavigate, Link } from 'react-router-dom'

function Account() {
  const navigate = useNavigate()
  const user = (() => {
    try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
  })()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.dispatchEvent(new Event('auth-changed'))
    navigate('/')
  }

  if (!user) {
    navigate('/login')
    return null
  }

  return (
    <div className="px-4 py-16 max-w-md mx-auto text-center">
      <p className="font-serif text-2xl text-sage-dark mb-1">Hi, {user.name}</p>
      <p className="text-sm text-muted mb-8">{user.email}</p>
      <div className="flex flex-col gap-3 items-center">
        <Link to="/orders" className="text-sage text-sm underline">My Orders</Link>
        <Link to="/wishlist" className="text-sage text-sm underline">Wishlist</Link>
        <button
          onClick={handleLogout}
          className="bg-sage text-ivory px-8 py-3 rounded-lg text-sm shadow-soft hover:bg-sage-dark transition-colors mt-2"
        >
          Log out
        </button>
      </div>
    </div>
  )
}

export default Account
