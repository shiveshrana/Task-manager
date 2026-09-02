import api from './api'

export const projectService = {
  async list() {
    const response = await api.get('/api/v1/projects')
    return response.data
  },

  async get(id) {
    const response = await api.get(`/api/v1/projects/${id}`)
    return response.data
  },

  async create({ name, description }) {
    const response = await api.post('/api/v1/projects', { name, description: description || null })
    return response.data
  },

  async update(id, { name, description }) {
    const response = await api.put(`/api/v1/projects/${id}`, { name, description })
    return response.data
  },

  async remove(id) {
    await api.delete(`/api/v1/projects/${id}`)
  },

  async listTasks(id) {
    const response = await api.get(`/api/v1/projects/${id}/tasks`)
    return response.data
  },
}
