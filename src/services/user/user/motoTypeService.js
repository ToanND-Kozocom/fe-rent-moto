import apiClient from '@/services/api'

const motoTypeService = {
  path: '/moto-types',
  async all() {
    const { data } = await apiClient.get(`${this.path}`)
    return data
  },
}

export default motoTypeService
