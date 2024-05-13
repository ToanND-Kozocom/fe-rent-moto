import { Input } from '@/components/UI'
import { appConfig } from '@/config/app'
import { ROUTES_USER } from '@/config/routes'
import { useLoading } from '@/contexts/loading'
import orderService from '@/services/user/user/orderService'
import { daysDifference, priceString } from '@/utils/helpers'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

const OrderDetail = () => {
  const { id } = useParams()
  const [order, setOrder] = useState()
  const { showLoading, hideLoading } = useLoading()

  const redirectedHome = () => {
    navigate(ROUTES_USER.HOME)
  }

  const fetchOrder = () => {
    showLoading()
    orderService
      .show(id)
      .then(data => {
        setOrder(data)
        console.log(data)
      })
      .catch(err => {
        Alert.alert('Có lỗi thử lại sau!', () => redirectedHome)
      })
      .finally(() => {
        hideLoading()
      })
  }

  useEffect(() => {
    fetchOrder()
  }, [])
  return (
    <>
      <nav className="flex mb-5" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
          <li className="inline-flex items-center">
            <Link
              to={ROUTES_USER.HOME}
              className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              <svg
                className="w-3 h-3 me-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
              </svg>
              Home
            </Link>
          </li>
          <li className="inline-flex items-center">
            <Link
              to={ROUTES_USER.ORDER}
              className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              <svg
                className="w-3 h-3 me-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
              </svg>
              My order
            </Link>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg
                className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
              <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2">
                Order number: {order?.id}
              </span>
            </div>
          </li>
        </ol>
      </nav>
      <div className="font-[sans-serif] bg-gray-50">
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4 h-full">
          <div className="bg-[#3f3f3f] lg:h-screen lg:sticky lg:top-0">
            <div className="relative h-full">
              <div className="p-8 lg:overflow-auto lg:h-[calc(100vh-60px)]">
                <h2 className="text-2xl font-bold text-white">List moto</h2>
                <div className="space-y-6 mt-10">
                  {order?.details?.map((item, index) => (
                    <div key={index} className="grid sm:grid-cols-2 items-start gap-6">
                      <div className="px-4 py-6 shrink-0 bg-gray-50 rounded-md">
                        <img
                          src={item.moto.images[0]?.path ?? appConfig.defaultImageMoto}
                          className="w-full object-contain"
                        />
                      </div>
                      <div>
                        <h3 className="text-base text-white">{item.moto.name}</h3>
                        <ul className="text-xs text-white space-y-3 mt-4">
                          <li className="flex flex-wrap gap-4">
                            Price <span className="ml-auto">{priceString(item.moto.price)}</span>
                          </li>
                          <li className="flex flex-wrap gap-4">
                            Date rent
                            <span className="ml-auto">
                              {daysDifference(order.start_date, order.end_date)}
                            </span>
                          </li>

                          <li className="flex flex-wrap gap-4">
                            Total Price
                            <span className="ml-auto">{priceString(item.total_pay)}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-center text-white">
                    Rent package
                    <p className="ml-auto">{order?.rent_package_percent} %</p>
                  </div>
                  <h2 className="text-2xl font-bold text-white">Holiday</h2>
                  {order?.holidays?.map((holiday, index) => (
                    <div key={index} className="flex justify-center text-white">
                      {holiday.holiday.name}
                      <p className="ml-auto">{holiday.precent} %</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute left-0 bottom-0 bg-[#444] w-full p-4">
                <h4 className="flex flex-wrap gap-4 text-base text-white">
                  Total{' '}
                  <span className="ml-auto">
                    {priceString(
                      order?.details?.reduce(
                        (accumulator, item) => accumulator + item.total_pay,
                        0,
                      ),
                    )}
                  </span>
                </h4>
              </div>
            </div>
          </div>
          <div className="xl:col-span-2 h-max rounded-md p-8 sticky top-0">
            <h2 className="text-2xl font-bold text-[#333]">Info order</h2>
            <div className="mt-10">
              <div>
                <h3 className="text-lg font-bold text-[#333] mb-6">Personal Details</h3>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="relative flex items-center gap-3">
                    <p>Start date: </p>
                    <p>{order?.start_date}</p>
                  </div>
                  <div className="relative flex items-center gap-3">
                    <p>End date: </p>
                    <p>{order?.end_date}</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="relative flex items-center gap-3">
                    <p>Note: </p>
                    <p>{order?.user_note}</p>
                  </div>
                  <div className="relative flex items-center gap-3">
                    <p>Phone: </p>
                    <p>{order?.phone_number}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default OrderDetail
