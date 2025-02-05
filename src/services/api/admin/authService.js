import apiClient from '@/services/api'

const authService = {
  path: '/auth',
  async login(payload) {
    const { data } = await apiClient.post(`${this.path}/login`, payload)
    return data
  },
  async logout() {
    const { data } = await apiClient.post(`${this.path}/logout`)
    return data
  },
  async profile() {
    const { data } = await apiClient.get(`${this.path}/profile`)
    return data
  },
}

export default authService
