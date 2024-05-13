import { useEffect, useState } from 'react'
import { AuthUserContext } from '@/contexts/authUser'
import authService from '@/services/api/admin/authService'
import state from '@/utils/localStorage'
import apiClient from '@/services/api'
import { Toast } from '@/components/UI'

const AuthUserProvider = ({ children }) => {
  const [authUserToken, setAuthUserToken] = useState(state.getState('access_token_user'))

  // Login
  const authUserLogin = async data => {
    try {
      const response = await authService.login(data)
      setAuthUserToken(response.access_token)
    } catch (err) {
      return Promise.reject(err)
    }
  }

  // Logout
  const authUserLogout = async () => {
    try {
      await authService.logout()
      authRemove()
      Toast.success('Logout Success')
    } catch (err) {
      authUserRemove()
      // return Promise.reject(err)
    }
  }

  // Remove token
  const authUserRemove = () => {
    setAuthUserToken(null)
  }

  // Auto remove authToken when authToken invalid
  useEffect(() => {
    const interceptor = apiClient.interceptors.response.use(
      response => response,
      error => {
        if (
          error.status === 401 ||
          error.status === 403 ||
          error.response?.status === 401 ||
          error.response?.status === 403
        ) {
          authUserRemove()
        }
        return Promise.reject(error)
      },
    )

    return () => {
      apiClient.interceptors.response.eject(interceptor)
    }
  }, [])

  useEffect(() => {
    if (authUserToken) {
      state.setState('access_token_user', authUserToken)
    } else {
      state.removeState('access_token_user')
    }
  }, [authUserToken])

  const contextValue = {
    authUserToken,
    authUserLogin,
    authUserLogout,
    authUserRemove,
  }

  return <AuthUserContext.Provider value={contextValue}>{children}</AuthUserContext.Provider>
}

export default AuthUserProvider
