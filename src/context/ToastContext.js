import { useState, createContext, useEffect, useCallback } from 'react'

const ToastContext = createContext()

export default ToastContext
export const ToastContextProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    let timer
    if (toasts?.length > 0) {
      timer = setTimeout(() => {
        setToasts(prevToasts => prevToasts.slice(1))
      }, 3000)

      return () => clearTimeout(timer)
    } else {
      return () => clearTimeout(timer)
    }
  }, [toasts])

  const success = useCallback(
    function (msg) {
      let toast = { msg }
      toast.className = 'success'
      setToasts([toast])
    },
    [setToasts]
  )

  const error = useCallback(
    function (msg) {
      let toast = { msg }
      toast.className = 'danger'
      setToasts([toast])
    },
    [setToasts]
  )

  const warning = useCallback(
    function (msg) {
      let toast = { msg }
      toast.className = 'warning'
      setToasts([toast])
    },
    [setToasts]
  )

  const info = useCallback(
    function (msg) {
      let toast = { msg }
      toast.className = 'info'
      setToasts([toast])
    },
    [setToasts]
  )

  const notification = {
    success,
    error,
    warning,
    info
  }

  return (
    <ToastContext.Provider value={notification}>
      {children}
      {toasts.map((toast, index) => (
        <div
          className={`position-fixed success_msg alert top-0 end-0 start-auto m-2 alert-${toast.className} alert-dismissible fade show`}
          key={index}
        >
          {toast.msg}
        </div>
      ))}
    </ToastContext.Provider>
  )
}
