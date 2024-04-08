import apiClient from '@/services/api'

const motoService = {
  path: '/admin/motos',
  async list(params) {
    params = { ...params, per_page: 10 }
    const { data } = await apiClient.get(this.path, { params })
    return data
  },
  async show(id) {
    const { data } = await apiClient.get(`${this.path}/${id}`)
    return data
  },
  async create(payloads) {
    const { data } = await apiClient.post(this.path, payloads, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
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
  async exportExcel(params) {
    const data = await apiClient.get(`${this.path}/export`, { params }, { responseType: 'blob' })
    return data
  },
  async importExcel(payloads) {
    const {data} = await apiClient.post(`${this.path}/import`, payloads, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return data
  },
}

export default motoService
