import React from 'react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import motoService from '@/services/api/admin/motoService'
import { useSidebarActive } from '@/contexts/sidebarActive'
import { ROUTES_ADMIN } from '@/config/routes'
import { useLoading } from '@/contexts/loading'
import { useForm } from 'react-hook-form'
import { Input, Button, Select, Toast, Calendar } from '@/components/UI'
import motoTypeService from '@/services/api/admin/motoTypeService'
import { setErrorForInput } from '@/utils/handleErrors'
import './Css.css'

const MotoDetail = () => {
  const { setSidebarActive } = useSidebarActive()
  const { id } = useParams()
  const { showLoading, hideLoading } = useLoading()
  const [motoTypes, setMotoTypes] = useState()
  const [newImages, setNewImages] = useState([])
  const [imagesDelete, setImagesDelete] = useState([])
  const [calendarMoto, setCalendarMoto] = useState([])
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
  const eventStyleGetter = event => {
    let color
    switch (event.status) {
      case 'wait':
        color = '#fef08a'
        break
      case 'approve':
        color = '#60a5fa'
        break
      case 'cancel':
        color = '#ef4444'
        break
      case 'rent':
        color = '#34d399'
        break
      case 'deny':
        color = '#dc2626'
        break
      case 'complete':
        color = '#22d3ee'
        break
      default:
        color = '#fef08a'
    }

    const style = {
      backgroundColor: color,
      borderRadius: '5px',
      color: '#111827',
      border: '0px',
      display: 'block',
    }

    return {
      style: style,
    }
  }
  const {
    name: nameError,
    license_plate: licensePlateError,
    status: statusError,
    price: priceError,
    moto_type_id: motoTypeError,
    description: descriptionError,
    images: imagesError,
  } = errors

  const statusList = [
    { id: 0, value: 'active', name: 'active' },
    { id: 1, value: 'lost', name: 'lost' },
    { id: 2, value: 'repair', name: 'repair' },
    { id: 3, value: 'rent', name: 'rent' },
    { id: 4, value: 'block', name: 'block' },
  ]
  const fetchMoto = id => {
    showLoading()
    motoService
      .show(id)
      .then(data => {
        reset(data)
        setValue('moto_type', data['moto_type']['id'])
        setCalendarMoto(
          data.calendar.map(item => {
            return {
              id: item.id,
              start: item.start,
              end: item.end,
              title: item.status,
              status: item.status,
            }
          }),
        )
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
    motoService
      .update(id, data)
      .then(({ message }) => {
        Toast.success(message)
        fetchMoto(id)
        setNewImages([])
        setImagesDelete([])
      })
      .catch(err => {
        console.log(err?.response?.data.errors)
        setErrorForInput(err, setError)
      })
      .finally(() => {
        hideLoading()
      })
  }

  const deleteImg = id => {
    const newValue = getValues('images').filter(item => {
      return item.id !== id
    })
    setValue('images', newValue)
    setImagesDelete(prev => {
      return [...prev, id]
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
    fields = {
      ...fields,
      images: newImages,
      images_delete_id: imagesDelete,
      moto_type_id: fields.moto_type,
    }
    update(fields)
  }

  useEffect(() => {
    setSidebarActive(ROUTES_ADMIN.MOTO.INDEX)
    fetchMoto(id)
  }, [])

  useEffect(() => {
    motoTypeService
      .public()
      .then(( data ) => {
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
    <>
      <form
        className="mt-4 flex flex-col bg-gray-100 rounded-lg p-4 shadow-sm"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="font-bold text-2xl text-gray-700">Update moto</h1>
        {calendarMoto.length > 0 && (
          <Calendar
            events={calendarMoto}
            eventPropGetter={eventStyleGetter}
            defaultDate={calendarMoto[0]?.start}
          />
        )}

        <div className="mt-4">
          <label className="text-black">ID</label>
          <Input
            className="w-full bg-white rounded-md border-gray-300 text-black px-2 py-1"
            placeholder="id"
            name="id"
            disabled={true}
            control={control}
          />
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
          {(getValues('images') ?? []).map(element => (
            <div className="img-item" key={element.id}>
              <img src={element.path} alt="" />
              <Button
                type="button"
                className="btn-close-img"
                onClick={e => {
                  deleteImg(element.id)
                }}
              >
                <i className="fa-regular fa-xmark"></i>
              </Button>
            </div>
          ))}
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
        {newImages.length + (getValues('images') ?? []).length < 5 && (
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={e => {
              addImg(e)
            }}
          />
        )}

        <Button
          type="submit"
          className="mt-5 w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        >
          Update
        </Button>
      </form>
    </>
  )
}
export default MotoDetail
