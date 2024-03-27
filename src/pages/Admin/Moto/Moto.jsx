import { useEffect, useState } from 'react'
import { ROUTES_ADMIN } from '@/config/routes'
import { useSidebarActive } from '@/contexts/sidebarActive'
import { useLoading } from '@/contexts/loading'
import motoService from '@/services/api/admin/motoService'
import useHandleError from '@/hooks/useHandleError'
import { DEFAULT_PAGINATION_OBJECT } from '@/config/define'
import setPaginationData from '@/utils/pagination'
import { Table, Button, Select, Input } from '@/components/UI'
import { useNavigate } from 'react-router-dom/dist'
import { useForm } from 'react-hook-form'
import motoTypeService from '@/services/api/admin/motoTypeService'

const Moto = () => {
  const defaultValues = {
    name: '',
    license_plate: '',
    moto_type_id: '',
    sort: '',
  }
  const { setSidebarActive } = useSidebarActive()
  const { showLoading, hideLoading } = useLoading()
  const [motos, setMotos] = useState([])
  const [motoTypes, setMotoTypes] = useState([])
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
      headerName: 'name',
      field: 'name',
    },
    {
      headerName: 'license plate',
      field: 'license_plate',
    },
    {
      headerName: 'price',
      field: 'price',
    },
    {
      headerName: 'moto type',
      field: 'moto_type',
      valueGetter: row => {
        return row.moto_type.name
      },
    },
    {
      headerName: 'description',
      field: 'description',
    },
    {
      headerName: 'status',
      field: 'status',
    },
    {
      headerName: '',
      field: '',
      valueGetter: row => {
        return (
          <div className="flex justify-end gap-5">
            <Button
              onClick={() => {
                navigate(ROUTES_ADMIN.MOTO.UPDATE.replace(':id', row.id))
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
    { id: 1, value: 'active', name: 'active' },
    { id: 2, value: 'lost', name: 'lost' },
    { id: 3, value: 'repair', name: 'repair' },
    { id: 4, value: 'rent', name: 'rent' },
    { id: 5, value: 'block', name: 'block' },
  ]
  const sortList = [
    { id: 0, value: 'price,asc', name: 'Prices gradually increase' },
    { id: 1, value: 'price,desc', name: 'Prices gradually decrease' },
    { id: 2, value: 'created_at,desc', name: 'Latest added date' },
    { id: 3, value: 'created_at,asc', name: 'Oldest added date' },
    { id: 4, value: 'name,asc', name: 'Name' },
    { id: 5, value: 'status,asc', name: 'Status' },
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

  const fetchMotos = params => {
    showLoading()
    motoService
      .list(params)
      .then(({ data, meta }) => {
        setMotos(data)
        setPagination(setPaginationData(meta))
      })
      .catch(err => {
        handleResponseError(err)
      })
      .finally(() => {
        hideLoading()
      })
  }

  const fetchMotoTypes = () => {
    motoTypeService
      .all()
      .then(data => {
        data.push({
          id: -1,
          name: 'all',
        })
        setValue('moto_type_id', data.slice(-1)[0]['id'])
        setMotoTypes(data)
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
    fetchMotos({ ...dataSearch, page: selected })
  }
  const onSubmit = fields => {
    if (fields.moto_type_id == -1) {
      fields = {
        ...fields,
        moto_type_id: null,
      }
    }
    fetchMotos(fields)
    setDataSearch(fields)
  }

  useEffect(() => {
    setSidebarActive(ROUTES_ADMIN.MOTO.INDEX)
    fetchMotos()
    fetchMotoTypes()
  }, [])

  return (
    <>
      <h1 className="text-3xl mb-8">Moto</h1>
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
                name="name"
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
                options={motoTypes}
                name="moto_type_id"
                control={control}
              />
              <label class="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                Moto type
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
          <Button
            type="button"
            className="ml-auto gap-2"
            onClick={() => navigate(ROUTES_ADMIN.MOTO.CREATE)}
          >
            <i className="fa-regular fa-plus"></i>
            <span>Add new</span>
          </Button>
        </div>
        <Table
          columns={columns}
          rows={motos}
          pagination={pagination}
          handleChangePage={selected => handleChangePage(selected)}
        />
      </div>
    </>
  )
}

export default Moto
