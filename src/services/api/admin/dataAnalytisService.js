import apiClient from '@/services/api'

const dataAnalytisService = {
  path: 'admin/data-analytis',
  async yearly(params) {
    const { data } = await apiClient.get(`${this.path}/yearly-revenue`, { params })
    return data
  },
  async monthly(params) {
    const { data } = await apiClient.get(`${this.path}/monthly-revenue`, { params })
    return data
  },
  async statusMoto(params) {
    const { data } = await apiClient.get(`${this.path}/moto-status`, { params })
    return data
  },
}

export default dataAnalytisService
