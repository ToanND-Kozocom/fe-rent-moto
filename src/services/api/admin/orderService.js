import apiClient from '@/services/api'

const orderService = {
  path: '/admin/orders',
  async list(params) {
    const { data } = await apiClient.get(this.path, { params })
    return data
  },
  async error(params) {
    const { data } = await apiClient.get(`${this.path}/issue`, { params })
    return data
  },
  async show(id) {
    const { data } = await apiClient.get(`${this.path}/${id}`)
    return data
  },
  async complete(id, params) {
    const { data } = await apiClient.post(`${this.path}/${id}/complete`, params)
    return data
  },
  async deny(id,params) {
    const { data } = await apiClient.post(`${this.path}/${id}/deny`,params)
    return data
  },
  async paymentDeposit(id) {
    const { data } = await apiClient.post(`${this.path}/${id}/deposit-payment`)
    return data
  },
  async update(id, payloads) {
    const { data } = await apiClient.post(
      `${this.path}/${id}`,
      { ...payloads, _method: 'patch' },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
    return data
  },
}

export default orderService
