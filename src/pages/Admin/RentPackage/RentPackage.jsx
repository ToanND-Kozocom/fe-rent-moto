import { useEffect, useState } from 'react'
import { ROUTES_ADMIN } from '@/config/routes'
import { useSidebarActive } from '@/contexts/sidebarActive'
import { useLoading } from '@/contexts/loading'
import rentPackageService from '@/services/api/admin/rentPackageService'
import useHandleError from '@/hooks/useHandleError'
import { DEFAULT_PAGINATION_OBJECT } from '@/config/define'
import setPaginationData from '@/utils/pagination'
import { Table, Button, Select, Input, Badge, Alert, Toast } from '@/components/UI'
import { useNavigate } from 'react-router-dom/dist'
import { useForm } from 'react-hook-form'

const RentPackage = () => {
  const defaultValues = {
    name: '',
    status: '',
    sort: '',
  }
  const { setSidebarActive } = useSidebarActive()
  const { showLoading, hideLoading } = useLoading()
  const [rentPackages, setRentPackages] = useState([])
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION_OBJECT)
  const { handleResponseError } = useHandleError()
  const navigate = useNavigate()

  const handleActive = id => {
    Alert.alert('Submit active this package!', () => activePackage(id))
  }
  const activePackage = id => {
    showLoading()
    rentPackageService
      .active(id)
      .then(({message}) => {
        fetchRentpackage()
        Toast.success(message)
      })
      .catch(err => {
        handleResponseError(err)
      })
      .finally(() => {
        hideLoading()
      })
  }

  const columns = [
    {
      headerName: 'ID',
      field: 'id',
    },
    {
      headerName: 'Name',
      field: 'name',
    },
    {
      headerName: 'Description',
      field: 'name',
      valueGetter: row => {
        return row.details.map(detail => (
          <p key={detail.id}>
            {detail.rent_days_min}-{detail.rent_days_max}: {detail.percent}%
          </p>
        ))
      },
    },
    {
      headerName: 'status',
      field: 'status',
      valueGetter: row => {
        switch (row.status) {
          case 'active':
            return <Badge className="bg-green-100">{row.status}</Badge>
          case 'inactive':
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
            {row.status == 'inactive' && (
              <Button
                className="!bg-green-700"
                onClick={() => {
                  handleActive(row.id)
                }}
              >
                <i className="fa-duotone fa-check-to-slot"></i>
              </Button>
            )}
          </div>
        )
      },
    },
  ]

  const fetchRentpackage = params => {
    showLoading()
    rentPackageService
      .list(params)
      .then(({ data, meta }) => {
        setRentPackages(data)
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
    fetchRentpackage({ ...dataSearch, page: selected })
  }

  useEffect(() => {
    setSidebarActive(ROUTES_ADMIN.RENT_PACKAGES)
    fetchRentpackage()
  }, [])

  return (
    <>
      <h1 className="text-3xl mb-8">Rent package</h1>
      <div className="bg-white rounded p-5 shadow space-y-6">
        <Table
          columns={columns}
          rows={rentPackages}
          pagination={pagination}
          handleChangePage={selected => handleChangePage(selected)}
        />
      </div>
    </>
  )
}

export default RentPackage
