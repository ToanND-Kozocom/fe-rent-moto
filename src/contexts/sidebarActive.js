import React, { useContext } from 'react'

export const SidebarActiveContext = React.createContext(null)

export const useSidebarActive = () => useContext(SidebarActiveContext)
