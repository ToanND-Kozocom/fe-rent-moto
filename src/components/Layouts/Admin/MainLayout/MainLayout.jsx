import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Header from '@/components/Partials/Admin/Header'
import Sidebar from '@/components/Partials/Admin/Sidebar'
import { useAuth } from '@/contexts/auth'
import { ROUTES_AUTH } from '@/config/routes'

const MainLayout = () => {
  const [showSidebar, setShowSidebar] = useState(false)
  const { authToken } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!authToken) {
      navigate(ROUTES_AUTH.LOGIN, { replace: true })
    }
  }, [authToken])

  return (
    <div class="flex flex-row min-h-screen bg-gray-100 text-gray-800">
       <Sidebar />

      <main class="main flex flex-col flex-grow -ml-64 md:ml-0 transition-all duration-150 ease-in">
        
      <Header />

        <div class="main-content flex flex-col flex-grow p-4">
          <Outlet />
        </div>
        <footer class="footer px-4 py-6">
          <div class="footer-content">
            <p class="text-sm text-gray-600 text-center">
              © Toanf. All rights reserved.{' '}
              <a href="https://twitter.com/iaminos">by Toanf</a>
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default MainLayout
