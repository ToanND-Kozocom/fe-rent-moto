import { useEffect, useState } from 'react'
import { ROUTES_ADMIN } from '@/config/routes'
import { useSidebarActive } from '@/contexts/sidebarActive'
import { useLoading } from '@/contexts/loading'
import motoTypeService from '@/services/api/admin/motoTypeService'
import useHandleError from '@/hooks/useHandleError'
import { DEFAULT_PAGINATION_OBJECT } from '@/config/define'
import setPaginationData from '@/utils/pagination'
import { Table, Button, Modal } from '@/components/UI'
import FormCreateAndUpdate from './FormCreateAndUpdate'

const MotoType = () => {
  const { setSidebarActive } = useSidebarActive()
  const { showLoading, hideLoading } = useLoading()
  const [motoTypes, setMotoTypes] = useState([])
  const [motoTypeEdit, setMotoTypeEdit] = useState(null)
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION_OBJECT)
  const [isOpenModal, setIsOpenModal] = useState(false)
  const { handleResponseError } = useHandleError()

  const columns = [
    {
      headerName: 'ID',
      field: 'id',
    },
    {
      headerName: 'Moto type',
      field: 'name',
    },
    {
      headerName: 'Status',
      field: 'status',
      valueGetter: row => {
        return row.status === 'active' ? 'Active' : 'Block'
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
                setIsOpenModal(true)
                setMotoTypeEdit(row)
              }}
            >
              <i className="fa-regular fa-pen-to-square"></i>
            </Button>
          </div>
        )
      },
    },
  ]

  const fetchMotoTypes = params => {
    showLoading()

    motoTypeService
      .list({ ...params, per_page: 5 })
      .then(({ data, meta }) => {
        setMotoTypes(data)
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
    fetchMotoTypes({ page: selected })
  }

  useEffect(() => {
    setSidebarActive(ROUTES_ADMIN.MOTOTYPE)
    fetchMotoTypes()
  }, [])

  return (
    <>
      <h1 className="font-bold text-2xl text-gray-700">Moto type</h1>
      <div className="bg-white rounded p-5 shadow space-y-6">
        <Button type="button" className="ml-auto gap-2" onClick={() => setIsOpenModal(true)}>
          <i className="fa-regular fa-plus"></i>
          <span>Add new</span>
        </Button>
        <Table
          columns={columns}
          rows={motoTypes}
          pagination={pagination}
          handleChangePage={selected => handleChangePage(selected)}
        />
        <Modal
          isOpen={isOpenModal}
          close={() => {
            setIsOpenModal(false)
          }}
          afterLeave={() => {
            setMotoTypeEdit(null)
          }}
        >
          <FormCreateAndUpdate
            setIsOpenModal={setIsOpenModal}
            motoType={motoTypeEdit}
            fetchMotoTypes={fetchMotoTypes}
          />
        </Modal>
      </div>
    </>
  )
}

export default MotoType
