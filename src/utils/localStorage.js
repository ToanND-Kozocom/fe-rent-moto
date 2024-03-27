const state = {
  getState: key => {
    const localKey = localStorage.getItem(key)
    try {
      return JSON.parse(localKey)
    } catch {
      return localKey
    }
  },
  setState: (key, value) => {
    if (typeof value === 'object' || Array.isArray(value)) {
      localStorage.setItem(key, JSON.stringify(value))
      return
    }
    localStorage.setItem(key, value)
  },
  removeState: key => localStorage.removeItem(key),
  clear: () => localStorage.clear(),
  setToken: accessToken => {
    return localStorage.setItem('access_token', accessToken)
  },
  getToken() {
    return localStorage.getItem('access_token')
  },
  removeToken() {
    return localStorage.removeItem('access_token')
  },
}

export default state
