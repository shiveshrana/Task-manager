import api from './api'

export const taskService = {
  async list({ projectId } = {}) {
    const response = await api.get('/api/v1/tasks', {
      params: projectId ? { project_id: projectId } : {},
    })
    return response.data
  },

  async get(id) {
    const response = await api.get(`/api/v1/tasks/${id}`)
    return response.data
  },

  async create(task) {
    const response = await api.post('/api/v1/tasks', task)
    return response.data
  },

  async update(id, updates) {
    const response = await api.put(`/api/v1/tasks/${id}`, updates)
    return response.data
  },

  async remove(id) {
    await api.delete(`/api/v1/tasks/${id}`)
  },
}
