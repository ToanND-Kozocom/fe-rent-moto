import apiClient from '@/services/api'

const orderDetailService = {
  path: '/admin/order-details',

  async updateMoto(id, payloads) {
    const { data } = await apiClient.patch(`${this.path}/${id}/update-moto`, payloads)
    return data
  },
}

export default orderDetailService
