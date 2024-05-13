import { Button, Input, Moto, Select } from '@/components/UI'
import { useLoading } from '@/contexts/loading'
import motoService from '@/services/user/user/motoService'
import { useEffect, useState } from 'react'
import { DatePicker, Pagination } from 'antd'
import { useForm } from 'react-hook-form'
import { dateToString } from '@/utils/helpers'
import motoTypeService from '@/services/user/user/motoTypeService'

const { RangePicker } = DatePicker
const Home = () => {
  const defaultValueSearch = {
    name: '',
    sort: 'created_at.asc',
    start_date: '',
    end_date: '',
    moto_type_id: '',
    page: 1,
    per_page: 9,
  }
  const sortList = [
    { id: 0, value: 'price.asc', name: 'Prices gradually increase' },
    { id: 1, value: 'price.desc', name: 'Prices gradually decrease' },
    { id: 2, value: 'created_at.desc', name: 'Latest added date' },
    { id: 3, value: 'created_at.asc', name: 'Oldest added date' },
    { id: 4, value: 'name.asc', name: 'Name' },
    { id: 5, value: 'status.asc', name: 'Status' },
    { id: 6, value: '', name: 'all' },
  ]
  const [motos, setMotos] = useState([])
  const { showLoading, hideLoading } = useLoading()
  const [valueSearch, setValueSearch] = useState()
  const [meta, setMeta] = useState({})
  const [motoTypes, setMotoTypes] = useState([])

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    clearErrors,
  } = useForm({
    defaultValues: defaultValueSearch,
  })

  const onSubmit = async fields => {
    setValueSearch(fields)
    featchMotos(fields, null)
  }

  const hanldeChangeDateRange = e => {
    if (e) {
      const [startDate, endDate] = e
      setValue('start_date', dateToString(new Date(startDate)))
      setValue('end_date', dateToString(new Date(endDate)))
    } else {
      setValue('start_date', null)
      setValue('end_date', null)
    }
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

  const hanldeChangePage = page => {
    featchMotos(null, page)
    
  }

  const featchMotos = (paramsSearch = null, page = null) => {
    let params = paramsSearch ?? valueSearch ?? defaultValueSearch
    if (paramsSearch) {
      page = 1
    }
    if (page) {
      params = {
        ...params,
        page: page,
      }
    }
    if (params.moto_type_id == -1) {
      params.moto_type_id = null
    }
    showLoading()
    motoService
      .getlist(params)
      .then(({ data, meta }) => {
        setMeta(meta)
        setMotos(data)
        // setPagination(setPaginationData(meta))
      })
      .catch(err => {
        handleResponseError(err)
      })
      .finally(() => {
        hideLoading()
      })
  }

  useEffect(() => {
    setValueSearch(defaultValueSearch)
    fetchMotoTypes()
    featchMotos()
  }, [])
  return (
    <>
      <div className="py-6 bg-orange-100 h-12 border-t-4 border-red-600 flex justify-center items-center uppercase text-3xl font-bold">
        <p>Danh sách xe</p>
      </div>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex mt-3 gap-3">
            <div className="hidden md:flex relative">
              <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
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
            <Select options={motoTypes} name="moto_type_id" control={control} />

            <div className="relative h-10 mr-1">
              <RangePicker format="YYYY-MM-DD" onChange={e => hanldeChangeDateRange(e)} />
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
            <Button>search</Button>
          </div>
        </form>
      </div>
      <div className="grid mt-3 grid-cols-3 gap-3 justify-items-center">
        {motos.map(moto => (
          <Moto key={moto.id} moto={moto} />
        ))}
      </div>
      <div className="mt-12 w-full flex items-center justify-center">
        <Pagination
          showQuickJumper
          defaultCurrent={1}
          total={meta?.total ?? 0}
          onChange={e => hanldeChangePage(e)}
        />
      </div>
    </>
  )
}

export default Home
