import api from './api'

export const userService = {
  async list() {
    const response = await api.get('/api/v1/users')
    return response.data
  },

  async updateProfile(updates) {
    const response = await api.put('/api/v1/users/me', updates)
    return response.data
  },
}

export const dashboardService = {
  async getStats() {
    const response = await api.get('/api/v1/dashboard')
    return response.data
  },
}
