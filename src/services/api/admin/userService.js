import apiClient from '@/services/api'

const userService = {
  path: '/admin/users',
  async list(params) {
    const { data } = await apiClient.get(this.path, { params })
    return data
  },
  async show(id) {
    const { data } = await apiClient.get(`${this.path}/${id}`)
    return data
  },
  async block(id) {
    const { data } = await apiClient.post(`${this.path}/${id}`, {
      status: 'block',
      _method: 'patch',
    })
    return data
  },
  async active(id) {
    const { data } = await apiClient.post(`${this.path}/${id}`, {
      status: 'active',
      _method: 'patch',
    })
    return data
  },
  async resetPassword(id) {
    const { data } = await apiClient.post(`${this.path}/${id}/reset-password`)
    return data
  },
  async paymentDeposit(id) {
    const { data } = await apiClient.post(`${this.path}/${id}/deposit-payment`)
    return data
  },
  async exportExcel(params) {
    const data = await apiClient.get(`${this.path}/export`, { params }, { responseType: 'blob' })
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

export default userService
