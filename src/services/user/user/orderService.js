import apiClient from '@/services/user'

const orderService = {
  path: '/orders',
  async provisional(payloads) {
    const { data } = await apiClient.post(`${this.path}/temp-order`, payloads)
    return data
  },
  async create(payloads) {
    const { data } = await apiClient.post(`${this.path}`, payloads)
    return data
  },
  async list(params) {
    const { data } = await apiClient.get(`${this.path}`, { params })
    return data
  },
  async show(id) {
    const { data } = await apiClient.get(`${this.path}/${id}`)
    return data
  },
}

export default orderService
