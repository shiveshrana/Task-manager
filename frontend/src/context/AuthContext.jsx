import { createContext, useCallback, useEffect, useState } from 'react'
import { authService } from '../services/authService'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('taskflow_token')
    if (!token) {
      setLoading(false)
      return
    }
    try {
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)
    } catch {
      localStorage.removeItem('taskflow_token')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  const login = async (credentials) => {
    const { access_token: token } = await authService.login(credentials)
    localStorage.setItem('taskflow_token', token)
    const currentUser = await authService.getCurrentUser()
    setUser(currentUser)
    return currentUser
  }

  const register = async (payload) => {
    await authService.register(payload)
    return login({ email: payload.email, password: payload.password })
  }

  const logout = () => {
    localStorage.removeItem('taskflow_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
