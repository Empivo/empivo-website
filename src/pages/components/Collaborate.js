import React, { useEffect, useState, useContext } from 'react'
import { Form, Button, Modal } from 'react-bootstrap'
import { apiPost, apiGet } from '@/utils/apiFetch'
import apiPath from '@/utils/pathObj'
import useToastContext from '@/hooks/useToastContext'
import RedStar from './common/RedStar'
import { useForm } from 'react-hook-form'
import ErrorMessage from './ErrorMessage'
import AuthContext from '@/context/AuthContext'

const Collaborate = ({ open, onHide, taskID, setCollaborateView }) => {
  const notification = useToastContext()
  const { handleSubmit } = useForm()
  const { user } = useContext(AuthContext)
  const [employeeType, setEmployeeType] = useState('')
  const [employeeData, setEmployeeData] = useState([])
  const [employeeTypeError, setEmployeeTypeError] = useState('')

  const checkFields = () => {
    let isValid = true
    if (employeeType === '') {
      setEmployeeTypeError(true)
      isValid = false
    } else {
      setEmployeeTypeError(false)
    }
    return isValid
  }

  const statusPage = e => {
    setEmployeeType(e.target.value)
  }

  const onSubmit = async data => {
    try {
      const isValid = checkFields()
      if (!isValid) return
      let payload = {
        taskId: taskID?._id,
        employeeId: employeeType
      }

      const res = await apiPost(apiPath.collaborationRequest, payload)
      if (res.data.success === true) {
        setCollaborateView(false)
        notification.success(res.data.message)
      } else {
        notification.error(res?.data?.message)
      }
    } catch (error) {
      console.log('error:', error)
    }
  }

  const getEmployeeList = async () => {
    try {
      let payload = {
        taskId: taskID?._id
      }

      const res = await apiGet(apiPath.getEmployeeList, payload)
      setEmployeeData(res?.data?.results)
    } catch (error) {
      console.log('error:', error)
    }
  }

  useEffect(() => {
    getEmployeeList()
  }, [taskID])

  const filteredArray =
    employeeData && employeeData?.filter(item => item?._id !== user?._id)

  return (
    <div>
      <Modal show={open} onHide={onHide} centered className='agent-modal'>
        <Modal.Header className='d-flex justify-content-center' closeButton>
          <Modal.Title>Collaborate your task with other employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form
            onSubmit={handleSubmit(onSubmit, () => {
              const isValid = checkFields()
              if (!isValid) return
            })}
            method='post'
          >
            <Form.Group className='mb-3'>
              <Form.Label>
                Select your employee
                <RedStar />
              </Form.Label>
              <Form.Select
                aria-label='Default select example'
                value={employeeType}
                onChange={e => {
                  statusPage(e)
                  if (e) {
                    setEmployeeTypeError(false)
                  }
                }}
              >
                <option value=''>Please select employee</option>
                {filteredArray &&
                  filteredArray?.map((res, index) => {
                    return (
                      <option key={index} value={res?._id}>
                        {res?.name}
                      </option>
                    )
                  })}
              </Form.Select>
              {employeeTypeError && (
                <ErrorMessage message='Please select employee.' />
              )}
            </Form.Group>

            <div className='text-center'>
              {' '}
              <Button
                type='submit'
                className='theme_lg_btn text-decoration-none category-btn w-100'
              >
                Submit
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default Collaborate
