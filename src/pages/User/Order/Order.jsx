import { appConfig } from '@/config/app'
import { ROUTES_USER } from '@/config/routes'
import { useLoading } from '@/contexts/loading'
import orderService from '@/services/user/user/orderService'
import { daysDifference, priceString } from '@/utils/helpers'
import { Pagination } from 'antd'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Order = () => {
  const [orders, setOrders] = useState([])
  const [meta, setMeta] = useState()
  const [current, setCurrent] = useState([])
  const { showLoading, hideLoading } = useLoading()
  const navigate = useNavigate()

  const redirectedHome = () => {
    navigate(ROUTES_USER.HOME)
  }
  const fetchOrders = (page = null) => {
    showLoading()
    orderService
      .list({ page: page ?? current })
      .then(({ data, meta }) => {
        setOrders(data)
        setMeta(meta)
        console.log(meta)
      })
      .catch(err => {
        Alert.alert('Có lỗi thử lại sau!', () => redirectedHome)
      })
      .finally(() => {
        hideLoading()
      })
  }
  const hanldeChangePage = page => {
    setCurrent(page)
    fetchOrders(page)
  }
  useEffect(() => {
    setCurrent(1)
    fetchOrders()
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
              <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2">My order</span>
            </div>
          </li>
        </ol>
      </nav>
      <div>
        {orders.map((order, index) => (
          <div key={index} className="w-full bg-gray-100 mb-5 p-4">
            <div className="flex justify-between border-b-2 border-white">
              <h1>
                {order.start_date} to {order.end_date}
              </h1>
              <h1 className=" text-red-500">{order.status}</h1>
            </div>
            {order?.details?.map(detail => (
              <div className="flex w-full">
                <div className="flex w-full">
                  <div className="flex py-6 w-full">
                    <div className="h-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={detail.moto?.images[0]?.path ?? appConfig.defaultImageMoto}
                        alt="Front of satchel with blue canvas body, black straps and handle, drawstring top, and front zipper pouch."
                        className="h-full w-32 object-cover object-center"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col w-full flex-1">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900 w-full">
                          <h3>
                            <Link to={ROUTES_USER.MOTO.replace(':id', detail.moto?.id)}>
                              {detail.moto?.name}
                            </Link>
                          </h3>
                          <p className="ml-4">{priceString(detail?.price)}</p>
                        </div>
                      </div>

                      <div className="flex flex-1 items-end justify-between text-sm">
                        <p>Total pay</p>
                        <p className="text-gray-500">{priceString(detail?.total_pay)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="border-t-2 border-white p-3">
              <div className="flex justify-between">
                <h1>Date rent</h1>
                <h1>{daysDifference(order.start_date, order.end_date)}</h1>
              </div>
              <div className="flex justify-between">
                <h1>Rent package</h1>
                <h1>{order?.rent_package_percent} %</h1>
              </div>
              {order.holidays &&
                order.holidays.map(holiday => (
                  <div className="flex justify-between">
                    <h1>{holiday.holiday.name}</h1>
                    <h1>{holiday.precent} %</h1>
                  </div>
                ))}
              <div className="flex justify-between">
                <h1>Total</h1>
                <h1>
                  {priceString(
                    order?.details?.reduce((accumulator, item) => accumulator + item.total_pay, 0),
                  )}
                </h1>
              </div>
            </div>
            <div className="mt-6">
              <Link
                to={ROUTES_USER.ORDER_DETAIL.replace(':id', order.id)}
                className="flex gap-6 max-sm:flex-col mt-10"
              >
                <button className="rounded-md px-6 py-3 w-full text-sm font-semibold bg-[#333] text-white hover:bg-[#222]">
                  View detail
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-12 w-full flex items-center justify-center">
        {/* <Pagination
          showQuickJumper
          defaultCurrent={1}
          total={meta?.total ?? 0}
          onChange={e => hanldeChangePage(e)}
        /> */}
        <Pagination current={current} onChange={hanldeChangePage} total={meta?.last_page * 10} />;
      </div>
    </>
  )
}

export default Order
