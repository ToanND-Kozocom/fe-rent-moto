import { useEffect, useState } from 'react'
import { ROUTES_ADMIN } from '@/config/routes'
import { useSidebarActive } from '@/contexts/sidebarActive'
import { useLoading } from '@/contexts/loading'
import userService from '@/services/api/admin/userService'
import useHandleError from '@/hooks/useHandleError'
import { DEFAULT_PAGINATION_OBJECT } from '@/config/define'
import setPaginationData from '@/utils/pagination'
import { Table, Button, Select, Input, Badge, Alert, Toast } from '@/components/UI'
import { useNavigate } from 'react-router-dom/dist'
import { useForm } from 'react-hook-form'

const User = () => {
  const defaultValues = {
    name: '',
    status: '',
    sort: '',
  }
  const { setSidebarActive } = useSidebarActive()
  const { showLoading, hideLoading } = useLoading()
  const [users, setUsers] = useState([])
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION_OBJECT)
  const [dataSearch, setDataSearch] = useState(defaultValues)
  const { handleResponseError } = useHandleError()
  const navigate = useNavigate()

  const columns = [
    {
      headerName: 'ID',
      field: 'id',
    },
    {
      headerName: 'User name',
      field: 'name',
    },
    {
      headerName: 'Email',
      field: 'email',
    },
    {
      headerName: 'Phone number',
      field: 'phone_number',
    },
    {
      headerName: 'Dob',
      field: 'dob',
    },
    {
      headerName: 'Address',
      field: 'address',
    },
    {
      headerName: 'status',
      field: 'status',
      valueGetter: row => {
        switch (row.status) {
          case 'register':
            return <Badge className="bg-yellow-100">{row.status}</Badge>
          case 'active':
            return <Badge className="bg-green-100">{row.status}</Badge>
          case 'block':
            return <Badge className="bg-red-100">{row.status}</Badge>
        }
      },
    },
    {
      headerName: '',
      field: '',
      valueGetter: row => {
        return (
          <div className="flex justify-end gap-5">
            {row.status == 'active' && (
              <Button
                className="!bg-red-700"
                onClick={() => {
                  handleBlockUser(row.id)
                }}
              >
                <i className="fa-solid fa-lock"></i>
              </Button>
            )}

            {row.status == 'block' && (
              <Button
                className="!bg-green-700"
                onClick={() => {
                  handleUnlockUser(row.id)
                }}
              >
                <i className="fa-duotone fa-lock-open"></i>
              </Button>
            )}
            {row.status != 'register' && (
              <Button
                onClick={() => {
                  handleResestPassword(row.id)
                }}
              >
                <i className="fa-solid fa-rotate"></i>
              </Button>
            )}
            <Button
              onClick={() => {
                navigate(ROUTES_ADMIN.USER.UPDATE.replace(':id', row.id))
              }}
            >
              <i className="fa-regular fa-pen-to-square"></i>
            </Button>
          </div>
        )
      },
    },
  ]

  const statusList = [
    { id: 0, value: '', name: 'all' },
    { id: 1, value: 'register', name: 'register' },
    { id: 2, value: 'active', name: 'active' },
    { id: 3, value: 'block', name: 'block' },
  ]
  const sortList = [
    { id: 0, value: '', name: 'all' },
    { id: 1, value: 'name,asc', name: 'Name' },
    { id: 2, value: 'created_at,desc', name: 'Latest added date' },
    { id: 3, value: 'created_at,asc', name: 'Oldest added date' },
    { id: 6, value: 'phone_number,asc', name: 'Phone number' },
  ]

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

  const fetchUsers = params => {
    showLoading()
    userService
      .list(params)
      .then(({ data, meta }) => {
        setUsers(data)
        setPagination(setPaginationData(meta))
      })
      .catch(err => {
        handleResponseError(err)
      })
      .finally(() => {
        hideLoading()
      })
  }

  const handleChangePage = selected => {
    setPagination({ ...pagination, currentPage: selected })
    fetchUsers({ ...dataSearch, page: selected })
  }
  const blockUser = id => {
    userService
      .block(id)
      .then(({ message }) => {
        Toast.success(message)
        fetchUsers({ ...dataSearch, page: pagination.currentPage })
      })
      .catch(err => {
        handleResponseError(err)
      })
      .finally(() => {
        hideLoading()
      })
  }

  const unlockUser = id => {
    userService
      .active(id)
      .then(({ message }) => {
        Toast.success(message)
        fetchUsers({ ...dataSearch, page: pagination.currentPage })
      })
      .catch(err => {
        handleResponseError(err)
      })
      .finally(() => {
        hideLoading()
      })
  }

  const resetPass = id => {
    userService
      .resetPassword(id)
      .then(({ message }) => {
        Toast.success(message)
      })
      .catch(err => {
        handleResponseError(err)
      })
      .finally(() => {
        hideLoading()
      })
  }

  const handleBlockUser = id => {
    Alert.alert('Cofirm block user', () => blockUser(id))
  }

  const handleUnlockUser = id => {
    Alert.alert('Cofirm unlock user', () => unlockUser(id))
  }

  const handleResestPassword = id => {
    Alert.alert('Cofirm reset password user', () => resetPass(id))
  }
  const onSubmit = fields => {
    setDataSearch(fields)
    fetchUsers(fields)
  }

  const exportExcel = () => {
    userService
      .exportExcel(dataSearch)
      
      .then(( blob) => {
        console.log(blob)
        // const link = document.createElement('a')
        // link.href = blob
        // link.setAttribute('download', 'filename.xlsx' ?? data.headers.filename)
        // document.body.appendChild(link)
        // link.click()

        // const data = await apiClient.get(url, {
        //   responseType: 'blob',
        // })
        const blobS = window.URL.createObjectURL(new Blob([blob.data]))
        const link = document.createElement('a')
        link.href = blobS
        link.setAttribute('download', 'users.csv' ?? data.headers.filename)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

      })
      .catch(err => {
        handleResponseError(err)
      })
      .finally(() => {
        hideLoading()
      })
  }

  useEffect(() => {
    setSidebarActive(ROUTES_ADMIN.USER.INDEX)
    fetchUsers()
  }, [])

  return (
    <>
      <h1 className="text-3xl mb-8">User</h1>
      <div className="bg-white rounded p-5 shadow space-y-6">
        <div className="flex">
          <form className="flex gap-2 flex-wrap" onSubmit={handleSubmit(onSubmit)}>
            <div className="hidden md:flex relative">
              <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  strokewinecap="round"
                  strokewinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <Input
                type="text"
                control={control}
                name="name"
                className="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-300 w-full h-10 focus:outline-none focus:border-indigo-400"
                placeholder="Search..."
              />
            </div>
            <div className="relative h-10 mr-1">
              <Select
                className="peer h-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-gray-900 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                options={statusList}
                name="status"
                control={control}
              />
              <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                Status
              </label>
            </div>
            <div className="relative h-10 mr-1">
              <Select
                className="peer h-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-gray-900 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                options={sortList}
                name="sort"
                control={control}
              />
              <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                Sort
              </label>
            </div>
            <Button className="ml-auto gap-2">
              <span>Tìm kiếm</span>
            </Button>
          </form>
          <Button className="ml-auto gap-2" onClick={exportExcel}>
            <span>Export excel</span>
          </Button>
        </div>
        <Table
          columns={columns}
          rows={users}
          pagination={pagination}
          handleChangePage={selected => handleChangePage(selected)}
        />
      </div>
    </>
  )
}

export default User
