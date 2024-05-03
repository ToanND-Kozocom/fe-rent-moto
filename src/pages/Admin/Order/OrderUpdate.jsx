import React from 'react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSidebarActive } from '@/contexts/sidebarActive'
import { ROUTES_ADMIN } from '@/config/routes'
import { useLoading } from '@/contexts/loading'
import { useForm } from 'react-hook-form'
import { Table, Input, Button, Select, Toast, Alert, Modal } from '@/components/UI'
import orderService from '@/services/api/admin/orderService'
import { setErrorForInput } from '@/utils/handleErrors'
import FormCofirmPayment from './FormConfirmPayment'
import FormSearchMotoChange from './FormSearchMotoChange'
import FormDenyOrder from './FormDenyOrder'
import { priceString } from '@/utils/helpers'

const OrderUpdate = () => {
  const { setSidebarActive } = useSidebarActive()
  const { id } = useParams()
  const { showLoading, hideLoading } = useLoading()
  const [motos, setMotos] = useState()
  const [order, setOrder] = useState()
  const [holidays, setHolidays] = useState()
  const [transactions, setTransactions] = useState()
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [isOpenModalChangeMoto, setIsOpenModalChangeMoto] = useState(false)
  const [isOpenModalDenyOrder, setIsOpenModalDenyOrder] = useState(false)
  const [orderDetailsOpen, setOderDetailsOpen] = useState(null)

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
    setError,
  } = useForm({
    defaultValues: {},
  })

  const { user_note: userNoteError, phone_number: phoneNumberError } = errors

  const statusList = [
    { id: 1, value: 'wait', name: 'wait' },
    { id: 2, value: 'approve', name: 'approve' },
    { id: 3, value: 'cancel', name: 'cancel' },
    { id: 4, value: 'rent', name: 'rent' },
    { id: 5, value: 'deny', name: 'deny' },
    { id: 6, value: 'complete', name: 'complete' },
  ]

  const typeList = [
    { id: 1, value: 1, name: 'DEPOSIT' },
    { id: 2, value: 2, name: 'PAYMENT' },
    { id: 3, value: 3, name: 'INCURRED' },
    { id: 4, value: 4, name: 'DISCOUNT' },
  ]

  const statusTransactionList = [
    { id: 1, value: 1, name: 'UNPAID' },
    { id: 2, value: 2, name: 'PAID' },
    { id: 3, value: 3, name: 'REFUND' },
  ]

  const holidayColumns = [
    {
      headerName: 'Name holiday',
      field: 'holiday_name',
      valueGetter: row => {
        return row.holiday.name
      },
    },
    {
      headerName: 'Date',
      field: 'holiday_name',
      valueGetter: row => {
        return row.holiday.date
      },
    },
    {
      headerName: 'Precent',
      field: 'precent',
      classNameTd: row => {
        return row.precent - 100 > 0 ? 'text-green-600' : 'text-red-600'
      },
      valueGetter: row => (
        <>
          <p className="flex gap-1">
            {Math.abs(row.precent - 100)}%
            {row.precent - 100 > 0 ? (
              <i className="fa-solid fa-caret-up"></i>
            ) : (
              <i class="fa-solid fa-sort-down"></i>
            )}
          </p>
        </>
      ),
    },
  ]

  const motoColumns = [
    // {
    //   headerName: 'detail id',
    //   field: 'id',
    //   classNameTd: row => {
    //     return !motoReadyRentStatus.includes(row.moto.status) ? 'text-red-600' : ''
    //   },
    // },
    {
      headerName: 'ID',
      field: 'id',
      valueGetter: row => (
        <Link
          className="text-blue-700 text-base hover:underline"
          to={ROUTES_ADMIN.MOTO.UPDATE.replace(':id', row.moto.id)}
        >
          {row.moto.id ?? ''}
        </Link>
      ),

      classNameTd: row => {
        return !motoReadyRentStatus.includes(row.moto.status) ? 'text-red-600' : ''
      },
    },
    {
      headerName: 'Moto',
      field: 'moto',
      valueGetter: row => {
        return row.moto.name ?? ''
      },
      classNameTd: row => {
        return !motoReadyRentStatus.includes(row.moto.status) ? 'text-red-600' : ''
      },
    },
    {
      headerName: 'License plate',
      field: 'moto',
      valueGetter: row => {
        return row.moto.license_plate ?? ''
      },
      classNameTd: row => {
        return !motoReadyRentStatus.includes(row.moto.status) ? 'text-red-600' : ''
      },
    },
    {
      headerName: 'price',
      field: 'price',
      classNameTd: row => {
        return !motoReadyRentStatus.includes(row.moto.status) ? 'text-red-600' : ''
      },
      valueGetter: row => {
        return priceString(row.price)
      },
    },
    {
      headerName: 'Total pay',
      field: 'total_pay',
      classNameTd: row => {
        return !motoReadyRentStatus.includes(row.moto.status) ? 'text-red-600' : ''
      },
      valueGetter: row => {
        return priceString(row.total_pay)
      },
    },
    {
      headerName: 'status',
      field: 'status',
      valueGetter: row => {
        return row.moto.status ?? ''
      },
      classNameTd: row => {
        return !motoReadyRentStatus.includes(row.moto.status) ? 'text-red-600' : ''
      },
    },
    {
      headerName: '',
      field: 'status',
      valueGetter: row => (
        <>
          {orderCanUpdateStatus.includes(order.status) && (
            <div className="">
              <Button
                type="button"
                onClick={() => {
                  setOderDetailsOpen(row)
                  setIsOpenModalChangeMoto(true)
                }}
              >
                <i className="fa-solid fa-rotate"></i>
              </Button>
            </div>
          )}
        </>
      ),
      classNameTd: row => {
        return !motoReadyRentStatus.includes(row.moto.status) ? 'text-red-600' : ''
      },
    },
  ]

  const handlePaymentDeposit = () => {
    Alert.alert('Cofirm payment deposited', paymentDeposit)
  }

  const paymentDeposit = () => {
    showLoading()
    orderService
      .paymentDeposit(id)
      .then(data => {
        Toast.success('Payment successful')
        fetchOrder(id)
      })
      .catch(err => {
        //
      })
      .finally(() => {
        hideLoading()
      })
  }

  const transactionColumns = [
    {
      headerName: 'ID',
      field: 'id',
    },
    {
      headerName: 'type',
      field: 'type',
      valueGetter: row => {
        const typeRow = typeList.find((type)=>{
          return type.value == row.type
        })
        return typeRow.name
      },
    },
    {
      headerName: 'cost',
      field: 'cost',
      valueGetter: row => {
        return priceString(row.cost)
      },
    },
    {
      headerName: 'descriptions',
      field: 'descriptions',
    },
    {
      headerName: 'status',
      field: 'status',
      valueGetter: row => {
        const typeRow = statusTransactionList.find((type)=>{
          return type.value == row.status
        })
        return typeRow.name
      },
    },
    {
      headerName: 'Date payment',
      field: 'date_payment',
    },
    {
      headerName: '',
      field: '',
      valueGetter: row => {
        if (row.type === 1 && row.status === 1 && order.status === 'wait') {
          return (
            <Button
              type="button"
              onClick={() => {
                handlePaymentDeposit()
              }}
            >
              <i className="fa-sharp fa-solid fa-check"></i>
            </Button>
          )
        }
        return <></>
      },
    },
  ]

  const fetchOrder = () => {
    showLoading()
    orderService
      .show(id)
      .then(data => {
        reset(data)
        setMotos(data.details)
        setHolidays(data.holidays)
        setOrder(data)
        setTransactions(data.transactions)
      })
      .catch(err => {
        //
      })
      .finally(() => {
        hideLoading()
      })
  }

  const handleConfirmPayment = () => {
    setIsOpenModal(true)
  }

  const handleDenyPayment = async () => {
    setIsOpenModalDenyOrder(true)
  }

  const denyOrder = reason => {
    showLoading()
    orderService
      .deny(id, { reason_deny: reason })
      .then(data => {
        Toast.success('Deny successful')
        fetchOrder(id)
      })
      .catch(err => {
        const errorArrays = Object.values(err?.response?.data?.errors)
        const messageErrors = errorArrays
          .reduce((accumulator, currentValue) => accumulator.concat(currentValue), [])
          .join('\n')
        Toast.error(messageErrors)
      })
      .finally(() => {
        hideLoading()
      })
  }

  const update = data => {
    showLoading()
    orderService
      .update(id, data)
      .then(({ message }) => {
        Toast.success(message)
      })
      .catch(err => {
        Toast.error(err?.response?.data?.message)
        setErrorForInput(err, setError)
      })
      .finally(() => {
        hideLoading()
      })
  }

  const onSubmit = fields => {
    const data = {
      phone_number: fields.phone_number,
      user_note: fields.user_note,
    }
    update(data)
  }
  const motoReadyRentStatus = ['active', 'rent']
  const orderCanUpdateStatus = ['wait', 'approve']

  useEffect(() => {
    setSidebarActive(ROUTES_ADMIN.ORDER.INDEX)
    fetchOrder(id)
  }, [])

  return (
    <>
      <form
        className="mt-4 flex flex-col bg-gray-100 rounded-lg p-4 shadow-sm"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="font-bold text-2xl text-gray-700">Update order</h1>
        <Table className="mt-4" columns={holidayColumns} rows={holidays} />

        <Table className="mt-4" columns={motoColumns} rows={motos} />

        <Table className="mt-4" columns={transactionColumns} rows={transactions} />

        {order?.status == 'approve' && (
          <Button
            type="button"
            className="mt-5 w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            onClick={handleConfirmPayment}
          >
            Cofirm payment
          </Button>
        )}

        {orderCanUpdateStatus.includes(order?.status) && (
          <Button
            type="button"
            className="mt-5 w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            onClick={handleDenyPayment}
          >
            Deny
          </Button>
        )}

        <div className="mt-4">
          <label className="text-black">ID</label>
          <Input
            className="w-full bg-gray-300 rounded-md border-gray-300 text-black px-2 py-1"
            placeholder="id"
            name="id"
            disabled={true}
            control={control}
          />
        </div>

        <div className="mt-4">
          <label className="text-black">Status</label>
          <Input
            className="w-full bg-gray-300 rounded-md border-gray-300 text-black px-2 py-1"
            placeholder="status"
            name="status"
            disabled={true}
            control={control}
          />
        </div>

        <div className="mt-4">
          <label className="text-black">Rent package percent</label>
          <Input
            className="w-full bg-gray-300 rounded-md border-gray-300 text-black px-2 py-1"
            placeholder="rent_package_percent"
            name="rent_package_percent"
            disabled={true}
            control={control}
          />
        </div>

        <div className="mt-4">
          <label className="text-black">Start date</label>
          <Input
            className="w-full bg-gray-300 rounded-md border-gray-300 text-black px-2 py-1"
            placeholder="id"
            type="date"
            name="start_date"
            disabled={true}
            control={control}
          />
        </div>

        <div className="mt-4">
          <label className="text-black">End date</label>
          <Input
            className="w-full bg-gray-300 rounded-md border-gray-300 text-black px-2 py-1"
            placeholder="id"
            type="date"
            name="end_date"
            disabled={true}
            control={control}
          />
        </div>

        <div className="mt-4">
          <label className="text-black">Name</label>
          <Input
            type="text"
            className="w-full bg-gray-300 rounded-md border-gray-300 text-black px-2 py-1"
            placeholder="name"
            disabled={true}
            name="customer_name"
            control={control}
          />
        </div>

        <div className="mt-4">
          <label className="text-black">Reason deny</label>
          <Input
            type="text"
            className="w-full bg-gray-300 rounded-md border-gray-300 text-black px-2 py-1"
            placeholder="reason_deny"
            disabled={true}
            name="reason_deny"
            control={control}
          />
        </div>

        <div className="mt-4">
          <label className="text-black">User note</label>
          <Input
            className="w-full bg-white rounded-md border-gray-300 text-black px-2 py-1"
            placeholder="user note"
            name="user_note"
            control={control}
            error={userNoteError}
          />
        </div>

        <div className="mt-4">
          <label className="text-black">Phone number</label>
          <Input
            className="w-full bg-white rounded-md border-gray-300 text-black px-2 py-1"
            placeholder="license_plate"
            type="text"
            name="phone_number"
            control={control}
            error={phoneNumberError}
          />
        </div>

        <Modal
          isOpen={isOpenModal}
          close={() => {
            setIsOpenModal(false)
          }}
          afterLeave={() => {
            setMotoTypeEdit(null)
          }}
        >
          <FormCofirmPayment
            setIsOpenModal={setIsOpenModal}
            order={order}
            transactionColumns={transactionColumns}
            fetchOrder={fetchOrder}
          />
        </Modal>

        <Button
          type="submit"
          className="mt-5 w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        >
          Update
        </Button>
      </form>
      <Modal
        isOpen={isOpenModalChangeMoto}
        close={() => {
          setIsOpenModalChangeMoto(false)
        }}
        // afterLeave={() => {
        //   setMotoTypeEdit(null)
        // }}
      >
        <FormSearchMotoChange
          setIsOpenModalChangeMoto={setIsOpenModalChangeMoto}
          order={order}
          orderDetail={orderDetailsOpen}
          fetchOrder={fetchOrder}
          afterLeave={() => {
            setOderDetailsOpen(null)
          }}
        />
      </Modal>
      <Modal
        isOpen={isOpenModalDenyOrder}
        close={() => {
          setIsOpenModalDenyOrder(false)
        }}
        // afterLeave={() => {
        //   setMotoTypeEdit(null)
        // }}
      >
        <FormDenyOrder
          setIsOpenModalDenyOrder={setIsOpenModalDenyOrder}
          order={order}
          fetchOrder={fetchOrder}
        />
      </Modal>
    </>
  )
}
export default OrderUpdate
