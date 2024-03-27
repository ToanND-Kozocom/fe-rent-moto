import { Toast } from '@/components/UI'

const useHandleError = () => {
  const handleResponseError = error => {
    let message =
      error.response?.data?.message ||
      Object.values(error.response?.data?.errors || {}).join(', ') ||
      error.data?.message ||
      error.message ||
      error ||
      'Something went wrong. Please try again later.'
    message = message.replace(' (and 1 more error)', '')
    Toast.error(message)
  }

  return { handleResponseError }
}

export default useHandleError
