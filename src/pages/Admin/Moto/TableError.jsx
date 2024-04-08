import { useLoading } from '@/contexts/loading'
import { Table } from '@/components/UI'
import { useEffect, useState } from 'react'

const TableError = props => {
  const { errors } = props
  const { showLoading, hideLoading } = useLoading()
  const [costIncurred, setCostIncurred] = useState(0)

  const columns = [
    {
      headerName: 'Row',
      field: 'row',
    },
    {
      headerName: 'error',
      field: 'error',
      valueGetter: row => {
        return row.errors.map((item, index) => <p key={index}>{item}</p>)
      },
    },
  ]

  return (
    <section className="p-8 md:px-10 py-10 !bg-white rounded shadow overflow-y-auto">
      <Table className="" columns={columns} rows={errors} />
    </section>
  )
}

export default TableError
