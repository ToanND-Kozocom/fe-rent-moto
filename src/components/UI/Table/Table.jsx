import { SORT_TYPE } from '@/config/define'
import { useState } from 'react'
import { Pagination } from '@/components/UI'

const Table = props => {
  const {
    rows,
    columns,
    pagination,
    onSort = () => {},
    onRowClick = () => {},
    handleChangePage,
    className,
    showHeader = true,
    customNullDataText,
  } = props
  const { lastPage, total, currentPage } = pagination || {}
  const [sortOrder, setSortOrder] = useState({})

  const handleSort = columnName => {
    const newSortOrder = {
      sort_column: columnName,
      sort_type:
        sortOrder.sort_column === columnName && sortOrder.sort_type === SORT_TYPE.ASC
          ? SORT_TYPE.DESC
          : SORT_TYPE.ASC,
    }
    setSortOrder(newSortOrder)
    onSort(newSortOrder)
  }

  return (
    <div className="space-y-5">
      <div className="w-full overflow-x-auto">
        <table
          className={`w-full shadow-md sm:rounded-lg text-sm text-left rtl:text-right text-gray-500 ${className}`}
        >
          {showHeader && (
            <thead className="text-xs text-gray-700 uppercase bg-gray-300">
              <tr>
                {columns?.map((column, index) => {
                  const { sortable, headerName, field } = column
                  return (
                    <th
                      key={index}
                      onClick={() => {
                        if (sortable) {
                          handleSort(field)
                        }
                      }}
                      className={`px-6 py-4 ${sortable ? 'cursor-pointer' : ''}`}
                    >
                      <p>
                        {headerName}
                        {sortable && sortOrder.order_type && sortOrder.order_by === field && (
                          <i class="fa-solid fa-sort-down"></i>
                        )}
                      </p>
                    </th>
                  )
                })}
              </tr>
            </thead>
          )}
          <tbody>
            {rows?.length ? (
              rows?.map((row, index) => {
                return (
                  <tr key={index} className={`bg-white border-b`}>
                    {columns?.map((column, index) => {
                      const { getAction, valueGetter, field, handleName, classNameTd} = column
                      return (
                        <td
                          key={index}
                          onClick={() => {
                            onRowClick && onRowClick(row)
                          }}
                          className={`px-6 py-4 text-gray-900 ${classNameTd ? classNameTd(row): '' }`}
                        >
                          {valueGetter ? valueGetter(row) : getAction ? getAction(row) : row[field]}
                        </td>
                      )
                    })}
                  </tr>
                )
              })
            ) : (
              <tr className="bg-white">
                <td colSpan={columns?.length ?? 0} className="px-6 py-4 text-center text-gray-900">
                  {customNullDataText ? customNullDataText : 'Không có dữ liệu'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {handleChangePage && lastPage && currentPage ? (
        <div className="flex w-full overflow-x-auto">
          <div className="hidden md:flex flex-1"></div>
          <div className="flex-1">
            <Pagination
              pageCount={lastPage}
              currentPage={currentPage}
              onChangePage={handleChangePage}
            />
          </div>
          <div className="hidden md:flex flex-1 items-end justify-end">
            {!!total && (
              <p className="text-xs text-end text-gray-700 uppercase">{`Tổng: ${total}`}</p>
            )}
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

export default Table
