import { createContext, useContext, useState } from 'react'
import { login as loginApi } from '../services/adminService.js'

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem('adminUser')
    return stored ? JSON.parse(stored) : null
  })

  const login = async (email, password) => {
    const { data } = await loginApi(email, password)

    if (data.role !== 'admin') {
      throw new Error('This account does not have admin access')
    }

    localStorage.setItem('adminToken', data.token)
    localStorage.setItem('adminUser', JSON.stringify(data))
    setAdmin(data)
    return data
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    setAdmin(null)
  }

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export const useAdminAuth = () => useContext(AdminAuthContext)
