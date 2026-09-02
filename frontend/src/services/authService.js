import api from './api'

export const authService = {
  async register({ email, username, fullName, password }) {
    const response = await api.post('/api/v1/auth/register', {
      email,
      username,
      full_name: fullName || null,
      password,
    })
    return response.data
  },

  async login({ email, password }) {
    const response = await api.post('/api/v1/auth/login/json', { email, password })
    return response.data
  },

  async getCurrentUser() {
    const response = await api.get('/api/v1/auth/me')
    return response.data
  },
}
