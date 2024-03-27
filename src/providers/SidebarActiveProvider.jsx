import React, { useMemo, useState } from 'react'
import { SidebarActiveContext } from '@/contexts/sidebarActive'

const SidebarActiveProvider = ({ children }) => {
  const [sidebarActive, setSidebarActive] = useState('')

  const value = useMemo(
    () => ({
      sidebarActive,
      setSidebarActive: value => setSidebarActive(value),
    }),
    [sidebarActive],
  )

  return <SidebarActiveContext.Provider value={value}>{children}</SidebarActiveContext.Provider>
}

export default SidebarActiveProvider
