import apiClient from '@/services/api'

const motoTypeService = {
  path: '/admin/mototypes',
  async list(params) {
    const { data } = await apiClient.get(this.path, { params })
    return data
  },
  async all() {
    const { data } = await apiClient.get(`${this.path}/all`)
    return data
  },
  async public(params) {
    const { data } = await apiClient.get(`${this.path}/public`, { params })
    return data
  },
  async create(payloads) {
    const { data } = await apiClient.post(this.path, payloads)
    return data
  },
  async update(id, payloads) {
    const { data } = await apiClient.put(`${this.path}/${id}`, payloads)
    return data
  },
}

export default motoTypeService
