import axios from 'axios'
import { appConfig } from '@/config/app'
import state from '@/utils/localStorage'

const apiClient = axios.create({
  baseURL: appConfig.api.url,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  config => {
    const token = state.getState('access_token_user')
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  },
)

export default apiClient
