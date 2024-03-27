import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { MainLayout } from '@/components/Layouts/Admin'
import { lazy } from 'react'
import { ROUTES_ADMIN, ROUTES_AUTH } from '@/config/routes'

const Login = lazy(() => import('@/pages/Auth/Login'))
const Dashboard = lazy(() => import('@/pages/Admin/Dashboard'))
const Mototype = lazy(() => import('@/pages/Admin/MotoType'))
const Moto = lazy(() => import('@/pages/Admin/Moto/Moto'))
const MotoDetail = lazy(() => import('@/pages/Admin/Moto/MotoDetail'))
const MotoCreate = lazy(() => import('@/pages/Admin/Moto/MotoCreate'))
const Order = lazy(() => import('@/pages/Admin/Order/Order'))
const OrderUpdate = lazy(() => import('@/pages/Admin/Order/OrderUpdate'))


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
        path: ROUTES_ADMIN.ORDER.UPDATE,
        element: <OrderUpdate />,
      },
    ],
  },
  {
    path: ROUTES_AUTH.LOGIN,
    element: <Login />,
  },
])

const Routes = () => {
  return <RouterProvider router={router} />
}

export default Routes
