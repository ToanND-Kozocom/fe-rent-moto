import { Button } from '@/components/UI'
import { appConfig } from '@/config/app'
import { ROUTES_USER } from '@/config/routes'
import { useCart } from '@/contexts/cart'
import { priceString } from '@/utils/helpers'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

const Cart = props => {
  const { cart, deleteMotoCart } = useCart()
  const handleDeleteCart = moto => {
    deleteMotoCart(moto)
  }

  return (
    <>
      {cart.map((item, index) => (
        <div key={index}>
          <div className="mt-8">
            <div className="flex justify-between text-base font-medium text-gray-900 mb-1">
              <h2>
                {item.startDate} to {item.endDate}
              </h2>
            </div>
            <div className="flow-root">
              <ul role="list" className="-my-6 divide-y divide-gray-200">
                {item.motos.map(moto => (
                  <li key={moto.id} className="flex py-6">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={moto?.images[0]?.path ?? appConfig.defaultImageMoto}
                        alt="Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt."
                        className="h-full w-full object-cover object-center"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>
                            <Link to={ROUTES_USER.MOTO.replace(':id', moto.id)}>{moto.name}</Link>
                          </h3>
                          <p className="ml-4">{priceString(moto.price)}</p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">Salmon</p>
                      </div>
                      <div className="flex flex-1 items-end justify-end text-sm">
                        <div className="flex">
                          <Button
                            type="button"
                            className="font-medium bg-red-600 hover:bg-red-700"
                            onClick={() => handleDeleteCart(moto)}
                          >
                            <i className="fa-solid fa-trash-can"></i>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
            <div className="mt-6">
              <Link
                to={ROUTES_USER.CHECKOUT.replace(':id', item.cartId)}
                type="button"
                className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
              >
                Checkout
              </Link>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export default Cart
