import React from 'react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import userService from '@/services/api/admin/userService'
import { useSidebarActive } from '@/contexts/sidebarActive'
import { ROUTES_ADMIN } from '@/config/routes'
import { useLoading } from '@/contexts/loading'
import { useForm } from 'react-hook-form'
import { Input, Button, Select, Toast } from '@/components/UI'
import { setErrorForInput } from '@/utils/handleErrors'

const UserUpdate = () => {
  const { setSidebarActive } = useSidebarActive()
  const { id } = useParams()
  const { showLoading, hideLoading } = useLoading()
  const [user, setUser] = useState()
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

  const {
    name: nameError,
    status: statusError,
    phone_number: phoneNumberError,
    address: addressError,
  } = errors

  const statusList = [
    { id: 1, value: 'register', name: 'register' },
    { id: 2, value: 'active', name: 'active' },
    { id: 3, value: 'block', name: 'block' },
  ]

  const fetchUser = () => {
    showLoading()
    userService
      .show(id)
      .then(data => {
        reset(data)
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
    userService
      .update(id, data)
      .then(({ message }) => {
        Toast.success(message)
        fetchUser()
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
    console.log(fields)
    // fields = {
    //   ...fields,
    //   images: newImages,
    //   images_delete_id: imagesDelete,
    //   moto_type_id: fields.moto_type,
    // }
    update(fields)
  }

  useEffect(() => {
    setSidebarActive(ROUTES_ADMIN.USER.INDEX)
    fetchUser()
  }, [])

  return (
    <form
      className="mt-4 flex flex-col bg-gray-100 rounded-lg p-4 shadow-sm"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="font-bold text-2xl text-gray-700">Update user</h1>

      <div className="mt-4">
        <label className="text-black">ID</label>
        <Input
          className="w-full bg-gray-500 rounded-md border-gray-300 text-black px-2 py-1"
          placeholder="id"
          name="id"
          disabled={true}
          control={control}
        />
      </div>
      <div className="mt-4">
        <label className="text-black">Email</label>
        <Input
          className="w-full bg-gray-500 rounded-md border-gray-300 text-black px-2 py-1"
          placeholder="email"
          name="email"
          control={control}
          disabled={true}
        />
      </div>
      <div className="mt-4">
        <label className="text-black">Dob</label>
        <Input
          className="w-full bg-gray-500 rounded-md border-gray-300 text-black px-2 py-1"
          placeholder="Dob"
          type="date"
          name="dob"
          control={control}
          disabled={true}
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
        <Select
          label="Status"
          options={statusList}
          name="status"
          control={control}
          error={statusError}
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

      <div className="mt-4">
        <label className="text-black">Address</label>
        <Input
          className="w-full bg-white rounded-md border-gray-300 text-black px-2 py-1"
          placeholder="address"
          type="text"
          name="address"
          control={control}
          error={addressError}
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
export default UserUpdate
