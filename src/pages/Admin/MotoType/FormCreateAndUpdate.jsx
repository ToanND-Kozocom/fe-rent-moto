import { useForm } from 'react-hook-form'
import { useLoading } from '@/contexts/loading'
import { Button, Input, Select, Toast } from '@/components/UI'
import motoTypeService from '@/services/api/admin/motoTypeService'
import { setErrorForInput } from '@/utils/handleErrors'
import { useEffect } from 'react'

const statusList = [
  { id: 1, value: 'active', name: 'active' },
  { id: 0, value: 'block', name: 'block' },
]
const defaultValues = {
  name: '',
  status: 1,
}

const FormCreateAndUpdate = props => {
  const { setIsOpenModal, motoType, fetchMotoTypes } = props
  const { showLoading, hideLoading } = useLoading()

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: motoType ?? defaultValues,
  })

  const { name: nameError, status: statusError } = errors

  const createMotoType = fields => {
    showLoading()
    motoTypeService
      .create(fields)
      .then(() => {
        Toast.success('Add moto type successfully')
        setIsOpenModal(false)
        fetchMotoTypes()
      })
      .catch(err => {
        setErrorForInput(err, setError)
      })
      .finally(() => {
        hideLoading()
      })
  }

  const updateMotoType = fields => {
    showLoading()
    motoTypeService
      .update(motoType.id, fields)
      .then(({ message }) => {
        console.log(message)
        Toast.success(message)
        setIsOpenModal(false)
        fetchMotoTypes()
      })
      .catch(err => {
        setErrorForInput(err, setError)
      })
      .finally(() => {
        hideLoading()
      })
  }

  const onSubmit = fields => {
    if (motoType) {
      updateMotoType(fields)
    } else {
      createMotoType(fields)
    }
  }

  return (
    <section className="p-8 md:px-10 py-10 !bg-white rounded shadow">
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-3xl font-bold mb-8 text-center">{motoType ? 'Update' : 'Add new'}</h1>
        <div className="grid grid-cols-1 gap-4">
          <Input label="Name" name="name" control={control} error={nameError} autoComplete="off" />
          {motoType && (
            <Select
              label="Status"
              options={statusList}
              name="status"
              control={control}
              error={statusError}
            />
          )}
        </div>
        <Button type="submit" className="ml-auto">
          {motoType ? 'Update' : 'Add new'}
        </Button>
      </form>
    </section>
  )
}

export default FormCreateAndUpdate
