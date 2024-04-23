import { useForm } from 'react-hook-form'
import { useLoading } from '@/contexts/loading'
import { Button, Input, Select, Toast, Table, Alert } from '@/components/UI'
import { setErrorForInput } from '@/utils/handleErrors'
import { useEffect, useState } from 'react'
import orderService from '@/services/api/admin/orderService'

const FormDenyOrder = props => {
  const { setIsOpenModalDenyOrder, order, fetchOrder } = props
  const { showLoading, hideLoading } = useLoading()

  const handleConfirm = fields => {
    return Alert.alert('Confirm deny', () => fetchDenyOrder(fields))
  }
  const defaultValues = {
    reason: '',
    refundMoney: true,
  }
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues,
  })

  const onSubmit = fields => {
    handleConfirm(fields)
    // updateMotoType(fields)
  }
  const fetchDenyOrder = fields => {
    showLoading()
    orderService
      .deny(order.id, {
        reason_deny: fields.reason,
        refund_money: fields.refundMoney,
      })
      .then(({message}) => {
        Toast.success(message)
        setIsOpenModalDenyOrder(false)
        fetchOrder(order.id)
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

  return (
    <section className="p-8 md:px-10 py-10 !bg-white rounded shadow">
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-3xl font-bold mb-8 text-center">Cofirm deny order</h1>
        <div className="grid grid-cols-1 gap-4">
          <Input
            type="text"
            label="Reason deny"
            autoComplete="off"
            name="reason"
            control={control}
          />
          {order.status == 'approve' && (
            <div className="flex items-center mb-4">
              <Input
                id="refundMoney"
                type="checkbox"
                name="refundMoney"
                control={control}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="refundMoney" className="ms-2 text-sm font-medium text-gray-900">
                Refund money
              </label>
            </div>
          )}
          <Button className="ml-auto gap-2">
            <span>Confirm</span>
          </Button>
        </div>
      </form>
    </section>
  )
}

export default FormDenyOrder
