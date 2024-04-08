import apiClient from '@/services/api'

const rentPackageService = {
  path: '/admin/rent-packages',
  async list(params) {
    const { data } = await apiClient.get(this.path, { params })
    return data
  },
  async active(id) {
    const { data } = await apiClient.post(`${this.path}/${id}/active`)
    return data
  },
}

export default rentPackageService
