import React from 'react'
import { useEffect, useState } from 'react'
import motoService from '@/services/api/admin/motoService'
import { useSidebarActive } from '@/contexts/sidebarActive'
import { ROUTES_ADMIN } from '@/config/routes'
import { useLoading } from '@/contexts/loading'
import { useForm } from 'react-hook-form'
import { Input, Button, Select, Toast, Alert, Modal } from '@/components/UI'
import motoTypeService from '@/services/api/admin/motoTypeService'
import { setErrorForInput } from '@/utils/handleErrors'
import { useNavigate } from 'react-router-dom/dist'
import TableError from './TableError'
import './Css.css'

const MotoCreate = () => {
  const { setSidebarActive } = useSidebarActive()
  const { showLoading, hideLoading } = useLoading()
  const [motoTypes, setMotoTypes] = useState()
  const [newImages, setNewImages] = useState([])
  const [isOpenModel, setIsOpenModal] = useState(false)
  const [importErrors, setImportErrors] = useState([])
  const navigate = useNavigate()

  const statusList = [
    { id: 0, value: 'active', name: 'active' },
    { id: 1, value: 'lost', name: 'lost' },
    { id: 2, value: 'repair', name: 'repair' },
    { id: 3, value: 'rent', name: 'rent' },
    { id: 4, value: 'block', name: 'block' },
  ]
  const defaultValues = {
    name: '',
    license_plate: '',
    status: statusList[0]['value'],
    price: 0,
    moto_type_id: 100,
    description: '',
    images: [],
  }

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

  const {
    name: nameError,
    license_plate: licensePlateError,
    status: statusError,
    price: priceError,
    moto_type_id: motoTypeError,
    description: descriptionError,
    images: imagesError,
  } = errors

  const create = data => {
    showLoading()
    motoService
      .create(data)
      .then(({ message }) => {
        Toast.success('add success')
        navigate(ROUTES_ADMIN.MOTO.INDEX)
      })
      .catch(err => {
        setErrorForInput(err, setError)
      })
      .finally(() => {
        hideLoading()
      })
  }

  const addImg = e => {
    const file = e.target.files[0]
    e.target.value = null
    setNewImages(prev => {
      return [...prev, file]
    })
  }

  const deleteNewImg = index => {
    setNewImages(prev => {
      const newValue = prev.filter((item, i) => i !== index)
      return newValue
    })
  }

  const onSubmit = fields => {
    fields = { ...fields, images: newImages }
    create(fields)
  }

  const handleImportCsv = async () => {
    const file = await Alert.inputCsv('Input CSV')
    if (file) {
      showLoading()
      const payload = { file: file }
      motoService
        .importExcel(payload)
        .then(({ message }) => {
          Toast.success(message)
        })
        .catch(err => {
          Toast.error(err.response.data.message)
          console.log(err.response.data)
          if(err.response.data.data_errors){
            setImportErrors(err.response.data.data_errors)
            setIsOpenModal(true)
          }
        })
        .finally(() => {
          hideLoading()
        })
    }
  }

  useEffect(() => {
    setSidebarActive(ROUTES_ADMIN.MOTO.INDEX)
  }, [])

  useEffect(() => {
    motoTypeService
      .list()
      .then(({ data }) => {
        setValue('moto_type_id', data[0]['id'])
        setMotoTypes(data)
      })
      .catch(err => {
        // handleResponseError(err)
      })
      .finally(() => {
        hideLoading()
      })
  }, [])

  return (
    <form
      className="mt-4 flex flex-col bg-gray-100 rounded-lg p-4 shadow-sm"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex">
        <h1 className="font-bold text-2xl text-gray-700">Add moto</h1>
        <Button type="button" className="ml-auto gap-2" onClick={handleImportCsv}>
          <i className="fa-regular fa-file-csv"></i>
          <span>Import</span>
        </Button>
        {importErrors.length > 0 && (
          <Button type="button" className="ml-2 gap-2" onClick={() => setIsOpenModal(true)}>
            <i className="fa-sharp fa-solid fa-circle-exclamation"></i>
            <span>Error</span>
          </Button>
        )}
      </div>

      <div className="mt-4">
        <label className="text-black">Name</label>
        <Input
          className="w-full bg-white rounded-md border-gray-300 text-black px-2 py-1"
          placeholder="name"
          name="name"
          control={control}
          error={nameError}
        />
      </div>

      <div className="mt-4">
        <label className="text-black">License plate</label>
        <Input
          className="w-full bg-white rounded-md border-gray-300 text-black px-2 py-1"
          placeholder="license_plate"
          name="license_plate"
          control={control}
          error={licensePlateError}
        />
      </div>

      <div className="mt-4">
        <Select
          label="Status"
          options={statusList}
          name="status"
          control={control}
          error={statusError}
        />
      </div>

      <div className="mt-4">
        <label className="text-black">Price</label>
        <Input
          className="w-full bg-white rounded-md border-gray-300 text-black px-2 py-1"
          placeholder="license_plate"
          type="number"
          name="price"
          control={control}
          error={priceError}
        />
      </div>

      <div className="mt-4">
        <Select
          label="moto_type"
          options={motoTypes}
          name="moto_type"
          control={control}
          errors={motoTypeError}
        />
      </div>

      <div className="mt-4">
        <label className="text-black">Description</label>
        <Input
          className="w-full bg-white rounded-md border-gray-300 text-black px-2 py-1"
          placeholder="description"
          name="description"
          control={control}
          errors={descriptionError}
        />
      </div>
      <div className="mt-4 flex gap-4 wrap">
        {newImages.map((element, index) => (
          <div className="img-item" key={index}>
            <img src={URL.createObjectURL(element)} alt="" />
            <Button
              type="button"
              className="btn-close-img"
              onClick={() => {
                deleteNewImg(index)
              }}
            >
              <i className="fa-regular fa-xmark"></i>
            </Button>
          </div>
        ))}
      </div>
      {newImages.length < 5 && (
        <Input
          name="newImages"
          type="file"
          accept="image/png, image/jpeg"
          onChange={e => {
            clearErrors('images')
            addImg(e)
          }}
          error={imagesError}
        />
      )}

      <Button
        type="submit"
        className="mt-5 w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
      >
        Create
      </Button>
      <Modal
        isOpen={isOpenModel}
        close={() => {
          setIsOpenModal(false)
        }}
      >
        <TableError errors={importErrors} />
      </Modal>
    </form>
  )
}
export default MotoCreate
