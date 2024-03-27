import { useEffect } from 'react'
import { useSidebarActive } from '@/contexts/sidebarActive'
import { ROUTES_ADMIN } from '@/config/routes'

const Dashboard = () => {
  const { setSidebarActive } = useSidebarActive()

  useEffect(() => {
    setSidebarActive(ROUTES_ADMIN.DASHBOARD)
  }, [])

  return <h1 className="text-3xl">Dashboard</h1>
}

export default Dashboard
