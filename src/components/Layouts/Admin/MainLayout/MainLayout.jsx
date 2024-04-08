import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Header from '@/components/Partials/Admin/Header'
import Sidebar from '@/components/Partials/Admin/Sidebar'
import { useAuth } from '@/contexts/auth'
import { ROUTES_AUTH } from '@/config/routes'
import apiClient from '@/services/api'

const MainLayout = () => {
  const [showSidebar, setShowSidebar] = useState(false)
  const { authToken, authRemove } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!authToken) {
      navigate(ROUTES_AUTH.LOGIN, { replace: true })
    }
  }, [authToken])

  return (
    <div className="flex flex-row min-h-screen bg-gray-100 text-gray-800">
      <Sidebar />

      <main className="main flex flex-col flex-grow -ml-64 md:ml-0 transition-all duration-150 ease-in">
        <Header />

        <div className="main-content flex flex-col flex-grow p-4">
          <Outlet />
        </div>
        <footer className="footer px-4 py-6">
          <div className="footer-content">
            <p className="text-sm text-gray-600 text-center">
              © Toanf. All rights reserved. <span>by Toanf</span>
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default MainLayout
