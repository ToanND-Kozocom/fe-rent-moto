import apiClient from '@/services/user'

const authService = {
  path: '/auth',
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
