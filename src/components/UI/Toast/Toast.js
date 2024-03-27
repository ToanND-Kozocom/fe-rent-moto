import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const Toast = {
  toast(icon, title) {
    MySwal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: toast => {
        toast.onmouseenter = MySwal.stopTimer
        toast.onmouseleave = MySwal.resumeTimer
      },
    }).fire({ icon, title })
  },
  success(message) {
    this.toast('success', message)
  },
  error(message) {
    this.toast('error', message)
  },
}

export default Toast

