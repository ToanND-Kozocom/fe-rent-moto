import apiClient from '@/services/api'

const categoryService = {
  path: '/admin/motos',
  async list(params) {
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
}

export default categoryService
