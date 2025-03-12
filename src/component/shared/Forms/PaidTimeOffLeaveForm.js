import React, { useState, useEffect, useContext, useRef } from 'react'
import { useForm } from 'react-hook-form'
import ErrorMessage from '@/pages/components/ErrorMessage'
import { preventMaxInput } from '@/utils/constants'
import { Row, Col } from 'react-bootstrap'
import AuthContext from '@/context/AuthContext'
import apiPath from '@/utils/pathObj'
import { apiPost, apiPut } from '@/utils/apiFetch'
import useToastContext from '@/hooks/useToastContext'
import { useRouter } from 'next/router'
import SignPage from '@/pages/components/SignPage'
import RedStar from '@/pages/components/common/RedStar'

const PaidTimeOffLeaveForm = ({
  formCategoryType,
  formList,
  formView,
  indexForm,
  formLength,
  currentItem,
  isLastForm
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm()
  const notification = useToastContext()
  const router = useRouter()
  const { acceptedJobs, currentFormItem, setCurrentItem } =
    useContext(AuthContext)

  const [preview, setPreview] = useState({
    employeeSign: null,
    supervisorSign: null,
    humanSign: null
  })
  const [src, setSrc] = useState(null)
  const [imageName, setImageName] = useState({
    employeeSign: null,
    supervisorSign: null,
    humanSign: null
  })
  const [imageData, setImageData] = useState({
    employeeSign: null,
    supervisorSign: null,
    humanSign: null
  })
  const [modalOpen, setModalOpen] = useState({
    employeeSign: false,
    supervisorSign: false,
    humanSign: false
  })
  const imageRef1 = useRef(null)
  const imageRef2 = useRef(null)
  const imageRef3 = useRef(null)

  const handleImgChange = (e, text) => {
    const fileSize = (e.target.files[0]?.size / 1024).toFixed(2)
    if (fileSize > 10) {
      notification.error('Please select image below 10 kb')
    } else {
      setSrc(URL?.createObjectURL(e.target.files[0]))
      setModalOpen({ ...modalOpen, [text]: true })
      setImageName({ ...imageName, [text]: e.target.files[0]?.name })
    }
  }

  const onSubmit = async data => {
    try {
      let payload = {
        jobID: acceptedJobs?.Job?._id,
        companyID: acceptedJobs?.companyID,
        formType: formCategoryType,
        content: {
          ...data,
          employeeSign: JSON.stringify({
            employeeSign: imageData.employeeSign
          }),
          supervisorSign: JSON.stringify({
            supervisorSign: imageData.supervisorSign
          }),
          humanSign: JSON.stringify({ humanSign: imageData.humanSign })
        }
      }
      let res = {}
      if (
        Object.keys(currentFormItem.data || {})?.length > 0 ||
        Object.keys(currentItem)?.length > 0
      )
        res = await apiPut(apiPath.editForms, payload)
      else res = await apiPost(apiPath.submitForm, payload)
      if (res.data.success === true) {
        if (!currentFormItem.edit) formList()
        if (Object.keys(currentFormItem?.data || {})?.length > 0)
          router.push('/forms')
        if (formLength > indexForm + 1)
          setCurrentItem({
            ...currentFormItem,
            indexForm: indexForm + 1
          })
        notification.success(res?.data?.message)
      } else {
        notification.error(res?.data?.message)
      }
    } catch (error) {
      console.log('error:', error)
    }
  }

  const setFileImage = async (text1, image1, text2, image2, text3, image3) => {
    if (image1 && image2 && image3) {
      const imageData1 = JSON.parse(image1)[text1]
      const imageData2 = JSON.parse(image2)[text2]
      const imageData3 = JSON.parse(image3)[text3]
      setPreview({
        [text1]: imageData1,
        [text2]: imageData2,
        [text3]: imageData3
      })
      setImageData({
        [text1]: imageData1,
        [text2]: imageData2,
        [text3]: imageData3
      })
    }
  }

  const handleSave = (value, text, cond) => {
    if (cond === 'open') {
      setModalOpen({ ...modalOpen, [text]: false })
      return
    }
    if (cond) {
      setPreview({ ...preview, [text]: value })
    } else {
      setImageData({ ...imageData, [text]: value })
    }
  }

  useEffect(() => {
    if (Object.keys(currentFormItem?.data || {})?.length) {
      setFileImage(
        'employeeSign',
        currentFormItem.data?.employeeSign,
        'supervisorSign',
        currentFormItem.data?.supervisorSign,
        'humanSign',
        currentFormItem.data?.humanSign
      )
      reset(currentFormItem.data)
      setValue('employeeSign', '')
      setValue('supervisorSign', '')
      setValue('humanSign', '')
    }
  }, [currentFormItem.data])

  const handleKeyDown = event => {
    if (
      !['Backspace', 'Delete', 'Tab'].includes(event.key) &&
      !/[0-9.]/.test(event.key)
    ) {
      event.preventDefault()
    }
  }

  const handleObjectLength = obj => Object.keys(obj || {})?.length

  return (
    <div className='employee_application_form py-3'>
      <div className='similar_wrapper text-dark'>
        <div className='text_wrap_row text-center text-dark bg-light mb-4'>
          <strong className='text-lg'>
            Paid Time Off (PTO) Leave Request Form
          </strong>
        </div>
        <Row className='gy-4'>
          <Col md={6}>
            <label htmlFor='' className='m-0'>
              Date of request: <RedStar />
            </label>
            <div className='position-relative'>
              <input
                type='date'
                disabled={formView}
                className='form_input w-100'
                min={new Date().toISOString().split('T')[0]}
                {...register('requestDate', {
                  required: {
                    value: true,
                    message: 'Please enter date.'
                  }
                })}
              />
              <ErrorMessage message={errors?.requestDate?.message} />
            </div>
          </Col>
          <Col md={6}>
            <label htmlFor='' className='m-0'>
              Employee name: <RedStar />
            </label>
            <div className='position-relative'>
              <input
                type='text'
                className='form_input w-100'
                disabled={formView}
                maxLength={15}
                onInput={e => preventMaxInput(e, 15)}
                {...register('employeeName', {
                  required: {
                    value: true,
                    message: 'Please enter employee name.'
                  },
                  minLength: {
                    value: 2,
                    message: 'Minimum length must be 2.'
                  },
                  maxLength: {
                    value: 15,
                    message: 'Maximum length must be 15.'
                  }
                })}
              />
              <ErrorMessage message={errors?.employeeName?.message} />
            </div>
          </Col>

          <Col md={6}>
            <label htmlFor='' className='m-0'>
              Department: <RedStar />
            </label>
            <div className='position-relative'>
              <input
                type='text'
                className='form_input w-100'
                disabled={formView}
                maxLength={15}
                onInput={e => preventMaxInput(e, 15)}
                {...register('employeeDepartment', {
                  required: {
                    value: true,
                    message: 'Please enter department.'
                  },
                  minLength: {
                    value: 2,
                    message: 'Minimum length must be 2.'
                  },
                  maxLength: {
                    value: 15,
                    message: 'Maximum length must be 15.'
                  }
                })}
              />
              <ErrorMessage message={errors?.employeeDepartment?.message} />
            </div>
          </Col>
          <Col md={6}>
            <label htmlFor='' className='m-0'>
              Job title: <RedStar />
            </label>
            <div className='position-relative'>
              <input
                type='text'
                className='form_input w-100'
                disabled={formView}
                maxLength={15}
                onInput={e => preventMaxInput(e, 15)}
                {...register('employeeTitle', {
                  required: {
                    value: true,
                    message: 'Please enter job title.'
                  },
                  minLength: {
                    value: 2,
                    message: 'Minimum length must be 2.'
                  },
                  maxLength: {
                    value: 15,
                    message: 'Maximum length must be 15.'
                  }
                })}
              />
              <ErrorMessage message={errors?.employeeTitle?.message} />
            </div>
          </Col>
          <Col md={12}>
            <p className='text-dark mb-0'>
              <b>PTO</b> (Vacation/sick leave)
            </p>
          </Col>
          <Col md={4}>
            <label htmlFor='' className='m-0'>
              Start date:
            </label>
            <div className='position-relative'>
              <input
                type='date'
                disabled={formView}
                className='form_input w-100'
                min={new Date().toISOString().split('T')[0]}
                {...register('createdAt', {
                  // required: {
                  //   value: true,
                  //   message: 'Please enter start date.'
                  // }
                })}
              />
              {/* <ErrorMessage message={errors?.createdAt?.message} /> */}
            </div>
          </Col>
          <Col md={4}>
            <label htmlFor='' className='m-0'>
              End date:
            </label>
            <div className='position-relative'>
              <input
                type='date'
                disabled={formView}
                className='form_input w-100'
                min={new Date().toISOString().split('T')[0]}
                {...register('updatedAt', {
                  // required: {
                  //   value: true,
                  //   message: 'Please enter end date.'
                  // }
                })}
              />
              {/* <ErrorMessage message={errors?.updatedAt?.message} /> */}
            </div>
          </Col>
          <Col md={4}>
            <label htmlFor='' className='m-0'>
              Total hours:
            </label>
            <div className='position-relative'>
              <input
                type='number'
                className='form_input w-100'
                disabled={formView}
                onKeyDown={event => handleKeyDown(event)}
                {...register('PTOHours', {
                  // required: {
                  //   value: true,
                  //   message: 'Please enter total hours.'
                  // },
                  min: {
                    value: 0,
                    message: "Value can't be less than 0."
                  }
                })}
              />
              <ErrorMessage message={errors?.PTOHours?.message} />
            </div>
          </Col>
          <Col md={12}>
            <p className='text-dark mb-0'>
              <b>Bereavement leave </b> (Up to three days of paid leave due to a
              death in the immediate family is available.)
            </p>
          </Col>
          <Col md={4}>
            <label htmlFor='' className='m-0'>
              Start date:
            </label>
            <div className='position-relative'>
              <input
                type='date'
                disabled={formView}
                className='form_input w-100'
                min={new Date().toISOString().split('T')[0]}
                {...register('bereavementStartDate', {
                  // required: {
                  //   value: true,
                  //   message: 'Please enter start date.'
                  // }
                })}
              />
              {/* <ErrorMessage message={errors?.bereavementStartDate?.message} /> */}
            </div>
          </Col>
          <Col md={4}>
            <label htmlFor='' className='m-0'>
              End date:
            </label>
            <div className='position-relative'>
              <input
                type='date'
                disabled={formView}
                className='form_input w-100'
                min={new Date().toISOString().split('T')[0]}
                {...register('bereavementEndDate', {
                  // required: {
                  //   value: true,
                  //   message: 'Please enter end date.'
                  // }
                })}
              />
              {/* <ErrorMessage message={errors?.bereavementEndDate?.message} /> */}
            </div>
          </Col>
          <Col md={4}>
            <label htmlFor='' className='m-0'>
              Total hours:
            </label>
            <div className='position-relative'>
              <input
                type='number'
                className='form_input w-100'
                disabled={formView}
                onKeyDown={event => handleKeyDown(event)}
                {...register('bereavementHours', {
                  // required: {
                  //   value: true,
                  //   message: 'Please enter total hours.'
                  // },
                  min: {
                    value: 0,
                    message: "Value can't be less than 0."
                  }
                })}
              />
              <ErrorMessage message={errors?.bereavementHours?.message} />
            </div>
          </Col>

          <Col md={12}>
            <p className='text-dark mb-0'>
              <b>Jury duty leave </b>(Up to five days of paid leave for jury
              service is available.)
            </p>
          </Col>
          <Col md={4}>
            <label htmlFor='' className='m-0'>
              Start date:
            </label>
            <div className='position-relative'>
              <input
                type='date'
                disabled={formView}
                className='form_input w-100'
                min={new Date().toISOString().split('T')[0]}
                {...register('juryStartDate', {
                  // required: {
                  //   value: true,
                  //   message: 'Please enter start date.'
                  // }
                })}
              />
              {/* <ErrorMessage message={errors?.juryStartDate?.message} /> */}
            </div>
          </Col>
          <Col md={4}>
            <label htmlFor='' className='m-0'>
              End date:
            </label>
            <div className='position-relative'>
              <input
                type='date'
                disabled={formView}
                className='form_input w-100'
                min={new Date().toISOString().split('T')[0]}
                {...register('juryEndDate', {
                  // required: {
                  //   value: true,
                  //   message: 'Please enter end date.'
                  // }
                })}
              />
              {/* <ErrorMessage message={errors?.juryEndDate?.message} /> */}
            </div>
          </Col>
          <Col md={4}>
            <label htmlFor='' className='m-0'>
              Total hours:
            </label>
            <div className='position-relative'>
              <input
                type='number'
                className='form_input w-100'
                disabled={formView}
                onKeyDown={event => handleKeyDown(event)}
                {...register('juryHours', {
                  // required: {
                  //   value: true,
                  //   message: 'Please enter total hours.'
                  // },
                  min: {
                    value: 0,
                    message: "Value can't be less than 0."
                  }
                })}
              />
              <ErrorMessage message={errors?.juryHours?.message} />
            </div>
          </Col>
          <Col md={12}>
            <p className='text-dark mb-0'>
              <b>Other</b>
            </p>
          </Col>
          <Col md={12} className='d-flex align-items-center'>
            <label htmlFor='' className='my-0 me-2'>
              Policy name (e.g., sabbatical leave, school visitation, etc.):
            </label>
            <div className='position-relative'>
              <input
                type='text'
                className='form_input flex-grow-1'
                disabled={formView}
                maxLength={15}
                onInput={e => preventMaxInput(e, 15)}
                {...register('policyName', {
                  // required: {
                  //   value: true,
                  //   message: 'Please enter policy name.'
                  // },
                  minLength: {
                    value: 2,
                    message: 'Minimum length must be 2.'
                  },
                  maxLength: {
                    value: 15,
                    message: 'Maximum length must be 15.'
                  }
                })}
              />
              <ErrorMessage message={errors?.policyName?.message} />
            </div>
          </Col>
          <Col md={4}>
            <label htmlFor='' className='m-0'>
              Start date:
            </label>
            <div className='position-relative'>
              <input
                type='date'
                disabled={formView}
                className='form_input w-100'
                min={new Date().toISOString().split('T')[0]}
                {...register('otherStartDate', {
                  // required: {
                  //   value: true,
                  //   message: 'Please enter start date.'
                  // }
                })}
              />
              {/* <ErrorMessage message={errors?.otherStartDate?.message} /> */}
            </div>
          </Col>
          <Col md={4}>
            <label htmlFor='' className='m-0'>
              End date:
            </label>
            <div className='position-relative'>
              <input
                type='date'
                disabled={formView}
                className='form_input w-100'
                min={new Date().toISOString().split('T')[0]}
                {...register('otherEndDate', {
                  // required: {
                  //   value: true,
                  //   message: 'Please enter end date.'
                  // }
                })}
              />
              {/* <ErrorMessage message={errors?.otherEndDate?.message} /> */}
            </div>
          </Col>
          <Col md={4}>
            <label htmlFor='' className='m-0'>
              Total hours:
            </label>
            <div className='position-relative'>
              <input
                type='number'
                className='form_input w-100'
                disabled={formView}
                onKeyDown={event => handleKeyDown(event)}
                {...register('otherHours', {
                  // required: {
                  //   value: true,
                  //   message: 'Please enter total hours.'
                  // },
                  min: {
                    value: 0,
                    message: "Value can't be less than 0."
                  }
                })}
              />
              <ErrorMessage message={errors?.otherHours?.message} />
            </div>
          </Col>
          <Col md={12}>
            <p className='text-dark mb-0'>
              This form should not be used to request leave under the Family and
              Medical Leave Act (FMLA) or to request leave as an accommodation
              under the Americans with Disabilities Act (ADA). Employees should
              consult with HR to request leave under the FMLA or ADA.
            </p>
          </Col>

          <Col md={6}>
            <label htmlFor='' className='mt-2'>
              Employee signature <RedStar />
            </label>
            <SignPage
              imageName={imageName.employeeSign}
              register={register('employeeSign', {
                required: {
                  value: preview.employeeSign ? false : true,
                  message: 'Please select signature'
                }
              })}
              imageRef={imageRef1}
              formView={formView}
              handleImgChange={handleImgChange}
              modalOpen={modalOpen}
              handleSave={handleSave}
              src={src}
              text={'employeeSign'}
              image={preview?.employeeSign}
              errorCond={errors?.employeeSign}
              imageShow={handleObjectLength(currentFormItem.data)}
              errors={<ErrorMessage message='Please select employeeSign.' />}
            />
          </Col>
          <Col md={6}>
            <label htmlFor='' className='mt-2'>
              Date <RedStar />
            </label>
            <div className='position-relative'>
              <input
                type='date'
                disabled={formView}
                className='form_input w-100'
                min={new Date().toISOString().split('T')[0]}
                {...register('employeeDate', {
                  required: {
                    value: true,
                    message: 'Please enter date.'
                  }
                })}
              />
              <ErrorMessage message={errors?.employeeDate?.message} />
            </div>
          </Col>
          <Col md={6}>
            <label htmlFor='' className='mt-2'>
              Supervisor signature <RedStar />
            </label>
            <SignPage
              imageName={imageName.supervisorSign}
              register={register('supervisorSign', {
                required: {
                  value: preview.supervisorSign ? false : true,
                  message: 'Please select signature'
                }
              })}
              imageRef={imageRef2}
              formView={formView}
              handleImgChange={handleImgChange}
              modalOpen={modalOpen}
              handleSave={handleSave}
              src={src}
              text={'supervisorSign'}
              image={preview?.supervisorSign}
              errorCond={errors?.supervisorSign}
              imageShow={handleObjectLength(currentFormItem.data)}
              errors={<ErrorMessage message='Please select supervisorSign.' />}
            />
          </Col>
          <Col md={6}>
            <label htmlFor='' className='mt-2'>
              Date <RedStar />
            </label>
            <div className='position-relative'>
              <input
                type='date'
                disabled={formView}
                className='form_input w-100'
                min={new Date().toISOString().split('T')[0]}
                {...register('supervisorDate', {
                  required: {
                    value: true,
                    message: 'Please enter date.'
                  }
                })}
              />
              <ErrorMessage message={errors?.supervisorDate?.message} />
            </div>
          </Col>
          <Col md={6}>
            <label htmlFor='' className='mt-2'>
              Human resources representative signature <RedStar />
            </label>
            <SignPage
              imageName={imageName.humanSign}
              register={register('humanSign', {
                required: {
                  value: preview.humanSign ? false : true,
                  message: 'Please select signature'
                }
              })}
              imageRef={imageRef3}
              formView={formView}
              handleImgChange={handleImgChange}
              modalOpen={modalOpen}
              handleSave={handleSave}
              src={src}
              text={'humanSign'}
              image={preview?.humanSign}
              errorCond={errors?.humanSign}
              imageShow={handleObjectLength(currentFormItem.data)}
              errors={<ErrorMessage message='Please select humanSign.' />}
            />
          </Col>
          <Col md={6}>
            <label htmlFor='' className='mt-2'>
              Date{' '}
              <label htmlFor='' className='mt-2'>
                Human resources representative signature <RedStar />
              </label>
            </label>
            <div className='position-relative'>
              <input
                type='date'
                disabled={formView}
                className='form_input w-100'
                min={new Date().toISOString().split('T')[0]}
                {...register('humanDate', {
                  required: {
                    value: true,
                    message: 'Please enter date.'
                  }
                })}
              />
              <ErrorMessage message={errors?.humanDate?.message} />
            </div>
          </Col>
          <Col md={12}>
            <p className='text-dark mb-0 fs-7'>
              <em>
                <b>
                  File original in the employee’s leave records and provide a
                  copy to the employee and the employee’s supervisor.
                </b>
              </em>
            </p>
          </Col>
        </Row>
      </div>
      <div className='change_direction'>
        {currentFormItem?.formLength === currentFormItem?.indexForm + 1 && (
          <isLastForm.lastForm
            length={currentFormItem?.formLength}
            index={currentFormItem?.indexForm}
            register={register('checkbox', {
              required: 'Please select checkbox.'
            })}
            errors={errors}
          />
        )}
        <div className='d-flex pt-4'>
          {formView !== true && (
            <button
              className='btn theme_md_btn text-white'
              onClick={handleSubmit(onSubmit)}
            >
              {' '}
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default PaidTimeOffLeaveForm
