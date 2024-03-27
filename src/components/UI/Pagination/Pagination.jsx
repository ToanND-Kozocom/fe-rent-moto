import { PAGINATION } from '@/config/define'
import ReactPaginate from 'react-paginate'

const Pagination = props => {
  const { pageCount, onChangePage, currentPage } = props

  return (
    <ReactPaginate
      breakLabel="..."
      previousLabel="<"
      nextLabel=">"
      forcePage={currentPage - 1}
      pageRangeDisplayed={PAGINATION.PAGE_RANGE_DISPLAY}
      pageCount={pageCount ?? 0}
      disableInitialCallback={true}
      renderOnZeroPageCount={null}
      className="flex justify-center items-center select-none"
      breakLinkClassName="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
      pageLinkClassName="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
      previousLinkClassName="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700"
      nextLinkClassName="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700"
      activeLinkClassName="!text-blue-800 !bg-blue-300"
      disabledLinkClassName="!bg-gray-200 !text-gray-400 cursor-default"
      onPageChange={({ selected }) => {
        onChangePage(selected + 1)
      }}
    />
  )
}

export default Pagination
