import React from 'react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSidebarActive } from '@/contexts/sidebarActive'
import { ROUTES_ADMIN } from '@/config/routes'
import { useLoading } from '@/contexts/loading'
import { useForm } from 'react-hook-form'
import { Table, Input, Button, Select, Toast, Alert } from '@/components/UI'
import orderService from '@/services/api/admin/orderService'
import { setErrorForInput } from '@/utils/handleErrors'

const OrderUpdate = () => {
  const { setSidebarActive } = useSidebarActive()
  const { id } = useParams()
  const { showLoading, hideLoading } = useLoading()
  const [motos, setMotos] = useState()
  const [order, setOrder] = useState()
  const [transactions, setTransactions] = useState()
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

  const { status: statusError, user_note: userNoteError, phone_number: phoneNumberError } = errors

  const statusList = [
    { id: 1, value: 'wait', name: 'wait' },
    { id: 2, value: 'approve', name: 'approve' },
    { id: 3, value: 'cancel', name: 'cancel' },
    { id: 4, value: 'rent', name: 'rent' },
    { id: 5, value: 'deny', name: 'deny' },
    { id: 6, value: 'complete', name: 'complete' },
  ]

  const motoColumns = [
    {
      headerName: 'ID',
      field: 'id',
    },
    {
      headerName: 'Moto',
      field: 'moto',
      valueGetter: row => {
        return row.moto.name ?? ''
      },
    },
    {
      headerName: 'License plate',
      field: 'moto',
      valueGetter: row => {
        return row.moto.license_plate ?? ''
      },
    },
    {
      headerName: 'price',
      field: 'price',
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
    },
    {
      headerName: 'cost',
      field: 'cost',
    },
    {
      headerName: 'descriptions',
      field: 'descriptions',
    },
    {
      headerName: 'status',
      field: 'status',
    },
    {
      headerName: '',
      field: '',
      valueGetter: row => {
        if (row.type === 'deposit' && row.status === 'unpaid' && order.status === 'wait') {
          return (
            <Button
              type="button"
              onClick={() => {
                handlePaymentDeposit()
              }}
            >
              <i class="fa-sharp fa-solid fa-check"></i>
            </Button>
          )
        }
        return <></>
      },
    },
  ]

  const fetchOrder = id => {
    showLoading()
    orderService
      .show(id)
      .then(data => {
        reset(data)
        setMotos(data.details)
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

  const update = data => {
    showLoading()
    orderService
      .update(id, data)
      .then(({ message }) => {
        Toast.success(message)
        fetchOrder(id)
      })
      .catch(err => {
        console.log(err?.response?.data.errors)
        setErrorForInput(err, setError)
      })
      .finally(() => {
        hideLoading()
      })
  }

  const onSubmit = fields => {
    fields = {
      ...fields,
    }
    console.log(fields)
    // update(fields)
  }

  useEffect(() => {
    setSidebarActive(ROUTES_ADMIN.ORDER.INDEX)
    fetchOrder(id)
  }, [])

  return (
    <form
      className="mt-4 flex flex-col bg-gray-100 rounded-lg p-4 shadow-sm"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="font-bold text-2xl text-gray-700">Update order</h1>
      <Table className="mt-4" columns={motoColumns} rows={motos} />

      <Table className="mt-4" columns={transactionColumns} rows={transactions} />
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
          className="w-full bg-white rounded-md border-gray-300 text-black px-2 py-1"
          placeholder="name"
          name="user_name"
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

      <Button
        type="submit"
        className="mt-5 w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
      >
        Update
      </Button>
    </form>
  )
}
export default OrderUpdate
