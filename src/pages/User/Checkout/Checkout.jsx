import { Alert, Input } from '@/components/UI'
import { appConfig } from '@/config/app'
import { ROUTES_USER } from '@/config/routes'
import { useAuthUser } from '@/contexts/authUser'
import { useCart } from '@/contexts/cart'
import { useLoading } from '@/contexts/loading'
import useHandleError from '@/hooks/useHandleError'
import orderService from '@/services/user/user/orderService'
import { getOrderCartById } from '@/utils/cart'
import { setErrorForInput } from '@/utils/handleErrors'
import { daysDifference, priceString } from '@/utils/helpers'
import { filter, reduce } from 'lodash'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { redirect } from 'react-router-dom'

const Checkout = () => {
  const defaultValues = {
    user_note: '',
    phone_number: '',
  }
  const { authUserToken } = useAuthUser()
  const { id } = useParams()
  const order = getOrderCartById(id)
  const { showLoading, hideLoading } = useLoading()
  const { handleResponseError } = useHandleError()
  const [orderProvisional, setOrderProvisional] = useState([])
  const { deleteOrder } = useCart()
  const navigate = useNavigate()

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    clearErrors,
  } = useForm({
    defaultValues: defaultValues,
  })
  const redirectedHome = () => {
    redirect(ROUTES_USER.HOME)
  }
  const { user_note: userNoteError, phone_number: phoneNumberError } = errors
  const fetchProvisional = () => {
    const params = {
      start_date: order.startDate,
      end_date: order.endDate,
      motos: order.motos.map(moto => moto.id),
    }
    showLoading()
    orderService
      .provisional(params)
      .then(data => {
        setOrderProvisional(data)
      })
      .catch(err => {
        Alert.alert('Có lỗi thử lại sau!', () => redirectedHome)
      })
      .finally(() => {
        hideLoading()
      })
  }

  const onSubmit = fields => {
    const params = {
      start_date: order.startDate,
      end_date: order.endDate,
      motos: order.motos.map(moto => moto.id),
      phone_number: fields.phone_number,
    }
    if (fields.user_note) {
      params.user_note = fields.user_note
    }
    showLoading()
    orderService
      .create(params)
      .then(data => {
        Alert.notifications('Order successfully')
        deleteOrder(order.cartId)
        navigate(ROUTES_USER.HOME, { replace: true })
      })
      .catch(err => {
        if (err.response.status == 422) {
          setErrorForInput(err, setError)
        } else {
          handleResponseError(err)
        }
      })
      .finally(() => {
        hideLoading()
      })
  }

  // const onSubmit = fields => {
  //   showLoading()
  //   authUserLogin(fields)
  //     .then(() => {
  //       reset(defaultValues)
  //       setIsOpenModalLogin(false)
  //       Toast.success('Login successful')
  //     })
  //     .catch(err => {
  //       if (err.response.status == 422) {
  //         setErrorForInput(err, setError)
  //       } else {
  //         handleResponseError(err)
  //       }
  //     })
  //     .finally(() => {
  //       hideLoading()
  //     })
  // }

  useEffect(() => {
    if(!authUserToken){
      Alert.notifications('Please login')
      navigate(ROUTES_USER.HOME)
    }
    fetchProvisional()
  }, [])
  useEffect(() => {
    console.log(orderProvisional)
  }, [orderProvisional])
  return (
    <>
      <div className="font-[sans-serif] bg-gray-50">
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4 h-full">
          <div className="bg-[#3f3f3f] lg:h-screen lg:sticky lg:top-0">
            <div className="relative h-full">
              <div className="p-8 lg:overflow-auto lg:h-[calc(100vh-60px)]">
                <h2 className="text-2xl font-bold text-white">List moto</h2>
                <div className="space-y-6 mt-10">
                  {orderProvisional?.details?.map((item, index) => (
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
                              {daysDifference(
                                orderProvisional.start_date,
                                orderProvisional.end_date,
                              )}
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
                    <p className="ml-auto">{orderProvisional.rent_package_percent} %</p>
                  </div>
                  <h2 className="text-2xl font-bold text-white">Holiday</h2>
                  {orderProvisional?.holidays?.map((holiday, index) => (
                    <div key={index} className="flex justify-center text-white">
                      {holiday.holiday.name}
                      <p className="ml-auto">{holiday.precent} %</p>
                    </div>
                  ))}
                  {/* <div className="grid sm:grid-cols-2 items-start gap-6">
                    <div className="px-4 py-6 shrink-0 bg-gray-50 rounded-md">
                      <img
                        src="https://readymadeui.com/images/product11.webp"
                        className="w-full object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="text-base text-white">VelvetGlide Boots</h3>
                      <ul className="text-xs text-white space-y-3 mt-4">
                        <li>
                          Size <span className="float-right">37</span>
                        </li>
                        <li>
                          Quantity <span className="float-right">2</span>
                        </li>
                        <li>
                          Total Price <span className="float-right">$40</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 items-start gap-6">
                    <div className="px-4 py-6 shrink-0 bg-gray-50 rounded-md">
                      <img
                        src="https://readymadeui.com/images/product14.webp"
                        className="w-full object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="text-base text-white">Echo Elegance</h3>
                      <ul className="text-xs text-white space-y-3 mt-4">
                        <li>
                          Size <span className="float-right">37</span>
                        </li>
                        <li>
                          Quantity <span className="float-right">2</span>
                        </li>
                        <li>
                          Total Price <span className="float-right">$40</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 items-start gap-6">
                    <div className="px-4 py-6 shrink-0 bg-gray-50 rounded-md">
                      <img
                        src="https://readymadeui.com/images/product13.webp"
                        className="w-full object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="text-base text-white">Pumps</h3>
                      <ul className="text-xs text-white space-y-3 mt-4">
                        <li>
                          Size <span className="float-right">37</span>
                        </li>
                        <li>
                          Quantity <span className="float-right">2</span>
                        </li>
                        <li>
                          Total Price <span className="float-right">$40</span>
                        </li>
                      </ul>
                    </div>
                  </div> */}
                </div>
              </div>
              <div className="absolute left-0 bottom-0 bg-[#444] w-full p-4">
                <h4 className="flex flex-wrap gap-4 text-base text-white">
                  Total{' '}
                  <span className="ml-auto">
                    {priceString(
                      orderProvisional?.details?.reduce(
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
            <h2 className="text-2xl font-bold text-[#333]">Complete your order</h2>
            <form className="mt-10" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <h3 className="text-lg font-bold text-[#333] mb-6">Personal Details</h3>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="relative flex items-center">
                    <Input
                      type="text"
                      name="user_note"
                      placeholder="user_note"
                      control={control}
                      error={userNoteError}
                      className="px-4 py-3.5 bg-white text-[#333] w-full text-sm border-b-2 focus:border-[#333] outline-none"
                    />
                  </div>
                  <div className="relative flex items-center">
                    <Input
                      type="number"
                      name="phone_number"
                      placeholder="phone_number"
                      error={phoneNumberError}
                      control={control}
                      className="px-4 py-3.5 bg-white text-[#333] w-full text-sm border-b-2 focus:border-[#333] outline-none"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <div className="flex gap-6 max-sm:flex-col mt-10">
                  <button className="rounded-md px-6 py-3 w-full text-sm font-semibold bg-[#333] text-white hover:bg-[#222]">
                    Checkout
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default Checkout
