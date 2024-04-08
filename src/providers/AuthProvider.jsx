import { useEffect, useState } from 'react'
import { AuthContext } from '@/contexts/auth'
import authService from '@/services/api/admin/authService'
import state from '@/utils/localStorage'
import apiClient from '@/services/api'

const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(state.getToken())

  // Login
  const authLogin = async data => {
    try {
      const response = await authService.login(data)
      setAuthToken(response.access_token)
    } catch (err) {
      return Promise.reject(err)
    }
  }

  // Logout
  const authLogout = async () => {
    try {
      await authService.logout()
      authRemove()
    } catch (err) {
      return Promise.reject(err)
    }
  }

  // Remove token
  const authRemove = () => {
    setAuthToken(null)
  }

  // Auto remove authToken when authToken invalid
  useEffect(() => {
    const interceptor = apiClient.interceptors.response.use(
      response => response,
      error => {
        if (error.status === 401 || error.status === 403 || error.response?.status === 401|| error.response?.status === 403) {
          authRemove()
        }
        return Promise.reject(error)
      },
    )

    return () => {
      apiClient.interceptors.response.eject(interceptor)
    }
  }, [])

  useEffect(() => {
    if (authToken) {
      state.setToken(authToken)
    } else {
      state.removeToken()
    }
  }, [authToken])

  const contextValue = {
    authToken,
    authLogin,
    authLogout,
    authRemove,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export default AuthProvider
