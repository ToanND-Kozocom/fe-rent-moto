import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { MainLayout } from '@/components/Layouts/Admin'
import { MainLayout as MainLayoutUser } from '@/components/Layouts/User'
import { lazy } from 'react'
import { ROUTES_ADMIN, ROUTES_AUTH, ROUTES_USER } from '@/config/routes'

const Login = lazy(() => import('@/pages/Auth/Login'))
const Dashboard = lazy(() => import('@/pages/Admin/Dashboard'))
const Mototype = lazy(() => import('@/pages/Admin/MotoType'))
const Moto = lazy(() => import('@/pages/Admin/Moto/Moto'))
const MotoDetail = lazy(() => import('@/pages/Admin/Moto/MotoDetail'))
const MotoCreate = lazy(() => import('@/pages/Admin/Moto/MotoCreate'))
const Order = lazy(() => import('@/pages/Admin/Order/Order'))
const OrderError = lazy(() => import('@/pages/Admin/OrderError/OrderError'))
const OrderUpdate = lazy(() => import('@/pages/Admin/Order/OrderUpdate'))
const User = lazy(() => import('@/pages/Admin/User/User'))
const UserUpdate = lazy(() => import('@/pages/Admin/User/UserUpdate'))
const RentPackage = lazy(() => import('@/pages/Admin/RentPackage/RentPackage'))

//User
const HomeUser = lazy(() => import('@/pages/User/Home/Home'))

const router = createBrowserRouter([
  {
    path: ROUTES_ADMIN.HOME,
    element: <MainLayout />,
    children: [
      {
        path: ROUTES_ADMIN.DASHBOARD,
        element: <Dashboard />,
      },
      {
        path: ROUTES_ADMIN.MOTOTYPE,
        element: <Mototype />,
      },
      {
        path: ROUTES_ADMIN.MOTO.INDEX,
        element: <Moto />,
      },
      {
        path: ROUTES_ADMIN.MOTO.CREATE,
        element: <MotoCreate />,
      },
      {
        path: ROUTES_ADMIN.MOTO.UPDATE,
        element: <MotoDetail />,
      },
      {
        path: ROUTES_ADMIN.ORDER.INDEX,
        element: <Order />,
      },
      {
        path: ROUTES_ADMIN.ORDER.ERROR,
        element: <OrderError />,
      },
      {
        path: ROUTES_ADMIN.ORDER.UPDATE,
        element: <OrderUpdate />,
      },
      {
        path: ROUTES_ADMIN.USER.INDEX,
        element: <User />,
      },
      {
        path: ROUTES_ADMIN.USER.UPDATE,
        element: <UserUpdate />,
      },
      {
        path: ROUTES_ADMIN.RENT_PACKAGES,
        element: <RentPackage />,
      },
    ],
  },
  {
    path: ROUTES_AUTH.LOGIN,
    element: <Login />,
  },
  {
    path: ROUTES_USER.HOME,
    element: <MainLayoutUser />,
    children: [
      {
        path: ROUTES_USER.HOME,
        element: <HomeUser />,
      },
    ],
  },
])

const Routes = () => {
  return <RouterProvider router={router} />
}

export default Routes
