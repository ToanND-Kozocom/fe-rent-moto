import apiClient from '@/services/api'

const dataAnalytisService = {
  path: 'admin/data-analytis',
  async yearly(params) {
    const { data } = await apiClient.get(`${this.path}/get-yearly-revenue-statistics`, { params })
    return data
  },
  async monthly(params) {
    const { data } = await apiClient.get(`${this.path}/get-monthly-revenue-statistics`, { params })
    return data
  },
}

export default dataAnalytisService
