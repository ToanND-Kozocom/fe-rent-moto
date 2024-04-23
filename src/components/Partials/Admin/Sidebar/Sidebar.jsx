import { Link } from 'react-router-dom'
import { ROUTES_ADMIN } from '@/config/routes'
import { useSidebarActive } from '@/contexts/sidebarActive'
import { useLoading } from '@/contexts/loading'
import { useAuth } from '@/contexts/auth'
import './Sidebar.css'

const NAV_ITEMS = [
  {
    to: ROUTES_ADMIN.DASHBOARD,
    icon: 'fa-light fa-gauge-max',
    iconActive: 'fa-solid fa-gauge-max',
    text: 'Dashboard',
  },
  {
    to: ROUTES_ADMIN.MOTOTYPE,
    icon: 'fa-light fa-list',
    iconActive: 'fa-solid fa-list',
    text: 'MotoType',
  },
  {
    to: ROUTES_ADMIN.MOTO.INDEX,
    icon: 'fa-light fa-tags',
    iconActive: 'fa-solid fa-tags',
    text: 'Moto',
  },
  {
    to: ROUTES_ADMIN.ORDER.INDEX,
    icon: 'fa-sharp fa-thin fa-table-list',
    iconActive: 'fa-sharp fa-solid fa-table-list',
    text: 'Order',
  },
  {
    to: ROUTES_ADMIN.ORDER.ERROR,
    icon: 'fa-sharp fa-thin fa-table-list',
    iconActive: 'fa-sharp fa-solid fa-table-list',
    text: 'Order error',
  },
  {
    to: ROUTES_ADMIN.USER.INDEX,
    icon: 'fa-sharp fa-light fa-users',
    iconActive: 'fa-sharp fa-solid fa-users',
    text: 'User',
  },
  {
    to: ROUTES_ADMIN.RENT_PACKAGES,
    icon: 'fa-sharp fa-light fa-users',
    iconActive: 'fa-sharp fa-solid fa-users',
    text: 'Rent Package',
  },
]

const Sidebar = () => {
  const { sidebarActive } = useSidebarActive()
  const { showLoading, hideLoading } = useLoading()
  const { authLogout } = useAuth()

  const logout = () => {
    showLoading()
    authLogout().finally(() => {
      hideLoading()
    })
  }

  return (
    <aside className="sidebar w-64 md:shadow transform -translate-x-full md:translate-x-0 transition-transform duration-150 ease-in bg-indigo-900 min-w-60">
      <div className="sidebar-header flex items-center justify-center py-4">
        <div className="inline-flex">
          <Link to={ROUTES_ADMIN.HOME} className="inline-flex flex-row items-center">
            <span className="leading-10 text-gray-100 text-2xl font-bold ml-1 uppercase">
              Toanf shop
            </span>
          </Link>
        </div>
      </div>
      <div className="sidebar-content px-4 py-6">
        <ul className="flex flex-col w-full">
          {NAV_ITEMS.map((item, index) => {
            const isActive = sidebarActive == item.to
            return (
              <li className="my-px" key={index}>
                <Link
                  to={item.to}
                  className={`flex flex-row items-center h-10 px-3 rounded-lg  ${
                    isActive ? 'bg-gray-100' : 'hover:bg-gray-100 hover:text-gray-700 text-gray-300'
                  }`}
                  // onClick={() => setShowSidebar(false)}
                >
                  <span className="flex items-center justify-center text-lg">
                    <i className={isActive ? item.iconActive : item.icon}></i>
                  </span>
                  <span className="ml-3">{item.text}</span>
                </Link>
              </li>
            )
          })}

          <li className="my-px">
            <span className="flex font-medium text-sm text-gray-300 px-4 my-4 uppercase">
              Account
            </span>
          </li>
          <li className="my-px">
            <button
              className="w-full flex flex-row items-center h-10 px-3 rounded-lg hover:bg-gray-100 hover:text-gray-700 text-gray-300"
              onClick={logout}
            >
              <span className="flex items-center justify-center text-lg">
                <i className="fa-light fa-right-from-bracket"></i>
              </span>
              <span className="ml-3">Đăng xuất</span>
            </button>
          </li>
        </ul>
      </div>
    </aside>
  )
}

export default Sidebar
