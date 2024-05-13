import apiClient from '@/services/user'

const motoService = {
  path: '/motos',
  async getlist(params) {
    const { data } = await apiClient.get(`${this.path}`, { params })
    return data
  },
  async show(id) {
    const { data } = await apiClient.get(`${this.path}/${id}`)
    return data
  },
}

export default motoService
