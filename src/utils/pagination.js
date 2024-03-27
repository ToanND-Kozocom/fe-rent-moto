const setPaginationData = data => {
  const {
    current_page: currentPage,
    last_page: lastPage,
    total,
    per_page: perPage,
    from,
    to,
  } = data

  const paginationData = {
    currentPage,
    lastPage,
    total,
    perPage,
    from,
    to,
  }

  return paginationData
}

export default setPaginationData
