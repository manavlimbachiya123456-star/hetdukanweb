import Sidebar from './Sidebar.jsx'

function AdminLayout({ children }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-ivory">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-x-hidden">{children}</main>
    </div>
  )
}

export default AdminLayout
