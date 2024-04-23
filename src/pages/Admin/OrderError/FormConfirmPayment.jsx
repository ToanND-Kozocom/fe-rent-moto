import { useForm } from 'react-hook-form'
import { useLoading } from '@/contexts/loading'
import { Button, Input, Select, Toast, Table, Alert } from '@/components/UI'
import { setErrorForInput } from '@/utils/handleErrors'
import { useEffect, useState } from 'react'
import orderService from '@/services/api/admin/orderService'

const FormCofirmPayment = props => {
  const { setIsOpenModal, order, transactionColumns, fetchOrder } = props
  const { showLoading, hideLoading } = useLoading()
  const [costIncurred, setCostIncurred] = useState(0)
  const [descriptions, setDescriptions] = useState('')
  order.transactions.map(item => {
    if (item.type == 'incurred') {
      item.cost = costIncurred
      item.descriptions = descriptions
    }
  })

  const handleConfirm = () => {
    Alert.alert('Confirm payment', confirmPayment)
  }
  const confirmPayment = () => {
    let dataConfirmPayment ={}
    if(costIncurred !== 0){
      dataConfirmPayment = {
        incurred_cost: costIncurred,
        descriptions,
      }
    }

    showLoading()
    orderService
      .complete(order.id, dataConfirmPayment)
      .then(() => {
        Toast.success('Payment successfully')
        setIsOpenModal(false)
        fetchOrder(order.id)
      })
      .catch(err => {
        setErrorForInput(err, setError)
      })
      .finally(() => {
        hideLoading()
      })
  }

  const defaultValues = {
    incurred_cost: 0,
    descriptions: '',
  }
  const handleChangeCost = value => {
    setCostIncurred(value)
  }
  const {
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues,
  })

  //   const createMotoType = fields => {
  //     showLoading()
  //     motoTypeService
  //       .create(fields)
  //       .then(() => {
  //         Toast.success('Add moto type successfully')
  //         setIsOpenModal(false)
  //         fetchMotoTypes()
  //       })
  //       .catch(err => {
  //         setErrorForInput(err, setError)
  //       })
  //       .finally(() => {
  //         hideLoading()
  //       })
  //   }

  const onSubmit = fields => {
    console.log(fields)
    // updateMotoType(fields)
  }

  return (
    <section className="p-8 md:px-10 py-10 !bg-white rounded shadow">
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-3xl font-bold mb-8 text-center">Cofirm return moto</h1>
        <div className="grid grid-cols-1 gap-4">
          <Input
            type="number"
            label="Incurred cost"
            autoComplete="off"
            value={costIncurred}
            onChange={e => handleChangeCost(e.target.value * 1)}
          />
          <Input
            label="Descriptions"
            name="descriptions"
            autoComplete="off"
            onChange={e => setDescriptions(e.target.value)}
          />
        </div>
      </form>
      <div className="flex justify-end items-end mt-3">
        <p className="font-semibold text-lg">
          Tổng tiền:{' '}
          {order.transactions.reduce(
            (accumulator, currentTransaction) => accumulator + currentTransaction.cost,
            0,
          )}
        </p>
        <Button type="button" className="ml-auto mb-3" onClick={handleConfirm}>
          Payment
        </Button>
      </div>

      <Table className="" columns={transactionColumns} rows={order.transactions} />
    </section>
  )
}

export default FormCofirmPayment
