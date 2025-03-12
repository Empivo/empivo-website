import React, { useContext, useEffect, useState } from 'react'
import { Form, Button, Col, Row, Modal } from 'react-bootstrap'
import OtpInput from 'react18-input-otp'
import { apiPost } from '@/utils/apiFetch'
import apiPath from '@/utils/pathObj'
import useToastContext from '@/hooks/useToastContext'
import { useRouter } from 'next/router'
import AuthContext from '@/context/AuthContext'

const OTPVerify = ({ open, onHide, sendOTP, bodyData }) => {
  const router = useRouter()
  const { routePath } = useContext(AuthContext)

  const [otp, setOtp] = useState('')
  const [otpMobile, setOtpMobile] = useState('')
  const [counter, setCounter] = useState(59)
  const notification = useToastContext()

  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000)
    return () => clearInterval(timer)
  }, [counter])

  const onSubmit = async e => {
    e.preventDefault()
    if (otp.toString()?.length === 0 || otp.toString()?.length < 4) {
      notification.error('Please enter 4 digit OTP')
    } else if (otp.toString()?.length === 4) {
      const { status, data: item } = await apiPost(apiPath.registerUser, {
        ...bodyData,
        mobileOTP: otpMobile,
        emailOTP: otp
      })
      if (status === 200) {
        if (item.success) {
          notification.success(item?.message)
          router.push(routePath)
        } else {
          notification.error(item.message)
        }
      } else {
        notification.error(item.message)
      }
    }
  }
  return (
    <Modal show={open} onHide={onHide} centered className='agent-modal'>
      <Modal.Header className='d-flex justify-content-center' closeButton>
        <Modal.Title>Verify Email</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='w-100 d-flex justify-content-center align-items-center'>
          <Form className='container-fluid'>
            <Form.Group className='mb-3' controlId='formBasicEmail'>
              <div className='d-flex justify-content-between align-items-center mb-2'>
                <Form.Label>Email OTP</Form.Label>
                <Button
                  type='button'
                  onClick={() => {
                    if (counter === 0) {
                      setCounter(59)
                      sendOTP({ ...bodyData, resend: true })
                    }
                  }}
                  disabled={counter !== 0}
                  style={{ fontSize: '12px', padding: '3px' }}
                >
                  Resend OTP {counter !== 0 && `in ${counter} seconds`}
                </Button>
              </div>
              <OtpInput
                numInputs={4}
                value={otp}
                onChange={e => {
                  setOtp(e)
                }}
                isInputNum={true}
                shouldAutoFocus={true}
                inputStyle={{
                  width: '100%',
                  height: '40px',
                  borderRadius: '4px',
                  border: '1px solid black'
                }}
                separator={<span>-</span>}
              />
            </Form.Group>
            {/* <Form.Group className='mb-3' controlId='formBasicEmail'>
              <div className='d-flex justify-content-between align-items-center mb-2'>
                <Form.Label>Mobile OTP</Form.Label>
              </div>
              <OtpInput
                numInputs={4}
                value={otpMobile}
                onChange={e => {
                  setOtpMobile(e)
                }}
                isInputNum={true}
                inputStyle={{
                  width: '100%',
                  height: '40px',
                  borderRadius: '4px',
                  border: '1px solid black'
                }}
                separator={<span>-</span>}
              />
            </Form.Group> */}

            <Row className='flex-column-md-reverse'>
              <Col md={6}>
                {' '}
                <Button
                  onClick={onSubmit}
                  type='submit'
                  style={{ lineHeight: '30px' }}
                  className='w-75 d-block p-1 my-0'
                >
                  Verify OTP
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default OTPVerify
