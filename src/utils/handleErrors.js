import first from 'lodash/first'

export const setErrorForInput = (err, setError) => {
  const errorObj = err?.response?.data.errors
  if (!errorObj) return
  Object.keys(errorObj).forEach(error => {
    setError(error, { type: 'manual', message: first(errorObj[error]) })
  })
}

export const setCustomErrorForInput = (field, message, setError) => {
  if (!message) return
  setError(field, {
    type: 'manual',
    message: message,
  })
}
