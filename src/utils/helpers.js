import { editForm, fetchFormList } from '@/hooks/apiContainer/Form/FormApi'
import Swal from 'sweetalert2'
import { isEmpty } from 'lodash'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)
const Helpers = {
  alertFunction: (title, item, changeFunction) => {
    MySwal.fire({
      html: <strong>{title}</strong>,
      icon: 'warning',
      showConfirmButton: 'Okay',
      showCancelButton: true,
      confirmButtonColor: '#f05a28',
      confirmButtonText: 'Ok',
      cancelButtonText: 'Cancel',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        changeFunction(item)
      }
    })
  },
  downloadFile: url => {
    if (isEmpty(url)) {
      alert('Invalid URL')
      return false
    }
    const parts = url.split('/')
    const filename = parts[parts.length - 1]
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.responseType = 'blob'
    xhr.onload = () => {
      const a = document.createElement('a')
      const urls = window.URL.createObjectURL(xhr.response)
      a.href = urls
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    }
    xhr.send()
  },
  ternaryCondition: (condition, first, second) => {
    return condition ? first : second
  },
  andCondition: (first, second) => {
    return first && second
  },
  orCondition: (first, second) => {
    return first || second
  },
  handleResult: (condition, successCallback, errorCallback) => {
    if (condition) {
      successCallback()
    } else {
      errorCallback()
    }
  },
  calculateTotalBreakTime: (breakTimes, isBreak = true) => {
    let totalBreakTime = '0 hours 0 minutes'

    if (breakTimes?.length > 0) {
      const fullBreakTime = breakTimes.reduce((acc, data) => {
        const startTime = new Date(data?.startTime)
        const endTime = new Date(data?.endTime)

        if (startTime && endTime) {
          const userTimeBreakDifference = endTime - startTime
          const breakTimeToAdd =
            userTimeBreakDifference > 0 ? userTimeBreakDifference : 0
          return acc + breakTimeToAdd
        }

        return acc
      }, 0)

      const fullBreakHours = Math.floor(fullBreakTime / (1000 * 60 * 60))
      const fullBreakMinutes = Math.ceil(
        (fullBreakTime % (1000 * 60 * 60)) / (1000 * 60)
      )

      totalBreakTime = `${fullBreakHours} hours ${fullBreakMinutes} minutes`

      if (!isBreak) {
        return {
          hours: fullBreakHours,
          minutes: fullBreakMinutes
        }
      }
    }

    return isBreak ? totalBreakTime : null
  }
}
export default Helpers

export const handelFetchFormList = () => {
  fetchFormList({}, (loader, error, response) => {
    if (!error) {
      // setListData(response)
    }
  })
}

export const handelEditForm = (payload, setFormEdit) => {
  console.log('payload', payload)
  editForm(payload, (loader, error, response) => {
    if (!error) {
      setFormEdit(false)
      // return response
    }
  })
}
