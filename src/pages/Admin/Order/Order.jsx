import { useEffect, useState } from 'react'
import { ROUTES_ADMIN } from '@/config/routes'
import { useSidebarActive } from '@/contexts/sidebarActive'
import { useLoading } from '@/contexts/loading'
import orderService from '@/services/api/admin/orderService'
import useHandleError from '@/hooks/useHandleError'
import { DEFAULT_PAGINATION_OBJECT } from '@/config/define'
import setPaginationData from '@/utils/pagination'
import { Table, Button, Select, Input } from '@/components/UI'
import { useNavigate } from 'react-router-dom/dist'
import { useForm } from 'react-hook-form'

const Order = () => {
  const defaultValues = {
    phone_number: '',
    license_plate: '',
    moto_type_id: '',
    sort: '',
  }
  const { setSidebarActive } = useSidebarActive()
  const { showLoading, hideLoading } = useLoading()
  const [orders, setOrders] = useState([])
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
      field: 'user_name',
    },
    {
      headerName: 'status',
      field: 'status',
    },
    {
      headerName: 'Start date',
      field: 'start_date',
    },
    {
      headerName: 'End date',
      field: 'end_date',
    },
    {
      headerName: 'User note',
      field: 'user_note',
    },
    {
      headerName: 'Phone number',
      field: 'phone_number',
    },
    {
      headerName: 'Rent package',
      field: 'rent_package',
      valueGetter: row => {
        return row.rent_package_detail.rent_package.name ?? ''
      },
    },
    {
      headerName: 'Date complete',
      field: 'date_complete',
      valueGetter: row => {
        return row.date_complete ?? ''
      },
    },
    {
      headerName: '',
      field: '',
      valueGetter: row => {
        return (
          <div className="flex justify-end gap-5">
            <Button
              onClick={() => {
                navigate(ROUTES_ADMIN.ORDER.UPDATE.replace(':id', row.id))
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
    { id: 1, value: 'wait', name: 'wait' },
    { id: 2, value: 'approve', name: 'approve' },
    { id: 3, value: 'cancel', name: 'cancel' },
    { id: 4, value: 'rent', name: 'rent' },
    { id: 5, value: 'deny', name: 'deny' },
    { id: 6, value: 'complete', name: 'complete' },
  ]
  const sortList = [
    { id: 2, value: 'created_at,desc', name: 'Latest added date' },
    { id: 3, value: 'created_at,asc', name: 'Oldest added date' },
    { id: 4, value: 'start_date,asc', name: 'Earliest start date' },
    { id: 5, value: 'start_date,desc', name: 'Latest start date' },
    { id: 6, value: '', name: 'all' },
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

  const fetchOrders = params => {
    showLoading()
    orderService
      .list(params)
      .then(({ data, meta }) => {
        setOrders(data)
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
    fetchOrders({ ...dataSearch, page: selected })
  }
  const onSubmit = fields => {
    if (fields.moto_type_id == -1) {
      fields = {
        ...fields,
        moto_type_id: null,
      }
    }
    console.log(fields)
    fetchOrders(fields)
    setDataSearch(fields)
  }

  useEffect(() => {
    setSidebarActive(ROUTES_ADMIN.ORDER.INDEX)
    fetchOrders()
  }, [])

  return (
    <>
      <h1 className="text-3xl mb-8">Order</h1>
      <div className="bg-white rounded p-5 shadow space-y-6">
        <div className="flex">
          <form className="flex gap-2 flex-wrap" onSubmit={handleSubmit(onSubmit)}>
            <div class="hidden md:flex relative">
              <div class="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                <svg
                  class="h-6 w-6"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <Input
                type="text"
                control={control}
                name="phone_number"
                class="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-300 w-full h-10 focus:outline-none focus:border-indigo-400"
                placeholder="Search..."
              />
            </div>
            <div class="relative h-10 mr-1">
              <Select
                className="peer h-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-gray-900 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                options={statusList}
                name="status"
                control={control}
              />
              <label class="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                Status
              </label>
            </div>
            <div class="relative h-10 mr-1">
              <Select
                className="peer h-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-gray-900 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                options={sortList}
                name="sort"
                control={control}
              />
              <label class="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                Sort
              </label>
            </div>
            <Button className="ml-auto gap-2">
              <span>Tìm kiếm</span>
            </Button>
          </form>
        </div>
        <Table
          columns={columns}
          rows={orders}
          pagination={pagination}
          handleChangePage={selected => handleChangePage(selected)}
        />
      </div>
    </>
  )
}

export default Order
