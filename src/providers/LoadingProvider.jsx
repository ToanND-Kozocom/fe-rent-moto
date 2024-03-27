import React, { useMemo, useState } from 'react'
import { LoadingContext } from '@/contexts/loading'
import { LoadingOverlay } from '@/components/UI'

const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false)

  const valueLoading = useMemo(
    () => ({
      loading,
      showLoading: () => setLoading(true),
      hideLoading: () => setLoading(false),
    }),
    [loading],
  )

  return (
    <LoadingContext.Provider value={valueLoading}>
      <>
        {loading && <LoadingOverlay open />}
        {children}
      </>
    </LoadingContext.Provider>
  )
}

export default LoadingProvider
