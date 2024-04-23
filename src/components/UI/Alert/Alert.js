import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

export const Alert ={
  alert(title,callback){
    MySwal.fire({
      title: title,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes"
    }).then((result) => {
      if (result.isConfirmed) {
        callback()
      }
    });
  },
  async inputCsv(title){
    const { value: file } = await Swal.fire({
      title: title,
      input: "file",
      inputAttributes: {
        "accept": ".csv",
        "aria-label": "Input your file"
      }
    });
    return file
  },
  async input(title,placeholder){
    const { value: email } = await Swal.fire({
      title: title,
      input: "text",
      inputPlaceholder: placeholder
    });
    
    return email
  },
}

export default Alert

