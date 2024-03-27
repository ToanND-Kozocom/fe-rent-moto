import React, { useContext } from 'react'

export const LoadingContext = React.createContext(null)

export const useLoading = () => useContext(LoadingContext)
