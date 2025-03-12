import React, { useState, useEffect, useContext, useRef } from 'react'
import { useForm } from 'react-hook-form'
import ErrorMessage from '@/pages/components/ErrorMessage'
import AuthContext from '@/context/AuthContext'
import apiPath from '@/utils/pathObj'
import { apiPost, apiPut } from '@/utils/apiFetch'
import { InputGroup, Form } from 'react-bootstrap'
import { preventMaxInput } from '@/utils/constants'
import useToastContext from '@/hooks/useToastContext'
import { useRouter } from 'next/router'
import CropperModal from '@/pages/components/CropperModal'
import RedStar from '@/pages/components/common/RedStar'

const RequestForEmploymentForm = ({
  formCategoryType,
  formList,
  formView,
  indexForm,
  isLastForm,
  formLength,
  currentItem
}) => {
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    setValue,
    formState: { errors }
  } = useForm()
  const notification = useToastContext()
  const router = useRouter()
  const { acceptedJobs, currentFormItem, setCurrentItem } =
    useContext(AuthContext)

  const [preview, setPreview] = useState(null)
  const [src, setSrc] = useState(null)
  const [imageName, setImageName] = useState('')
  const [imageData, setImageData] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const imageRef = useRef(null)

  const handleImgChange = e => {
    const fileSize = (e.target.files[0]?.size / (1024 * 1024)).toFixed(2)
    if (fileSize > 1) {
      notification.error('Please select image below 1 mb')
    } else {
      setSrc(URL?.createObjectURL(e.target.files[0]))
      setModalOpen(true)
      setImageName(e.target.files[0]?.name)
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
          image: JSON.stringify({ image: imageData })
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

  useEffect(() => {
    if (preview) {
      setValue('image', imageName)
      clearErrors('image')
    }
  }, [preview])

  const setFileImage = async image => {
    if (image) {
      const image1 = JSON.parse(image)?.image
      setPreview(image1)
      setImageData(image1)
    }
  }

  useEffect(() => {
    if (Object.keys(currentFormItem?.data || {})?.length) {
      setFileImage(currentFormItem.data?.image)
      reset(currentFormItem.data)
      setValue('image', '')
    }
  }, [currentFormItem.data])

  const handleObjectLength = obj => Object.keys(obj || {})?.length > 0

  return (
    <div>
      <div className='employee_application_form_wrap'>
        <div className='text_wrap_row text-center text-dark bg-light p-3'>
          <strong className='text-lg'>
            REQUEST FOR EMPLOYMENT REFERENCE FORM
          </strong>
        </div>
        <div className='text_wrap_row'>
          <div className='form_group d-flex flex-wrap align-items-center  pe-3'>
            <label className='me-2'>The following applicant,</label>
            <div className='position-relative'>
              <input
                type='text'
                disabled={formView}
                maxLength={15}
                className='form_input flex-grow-1'
                {...register('applicantName', {
                  // required: {
                  //   value: true,
                  //   message: 'Please enter applicant.'
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
              <ErrorMessage message={errors?.applicantName?.message} />
            </div>
            <span>
              applied for a position with {acceptedJobs?.Company?.name} and
              would appreciate you providing the information requested
              concerning possible employment.
            </span>
          </div>
          <div className='form_group d-flex align-items-center mt-3'>
            <label className='me-2'>
              The applicant consents to release of this reference information to{' '}
              {acceptedJobs?.Company?.name}.
            </label>
            <div className='position-relative'>
              <input
                type='text'
                disabled={formView}
                className='form_input flex-grow-1'
                maxLength={15}
                onInput={e => preventMaxInput(e, 15)}
                {...register('employerName', {
                  // required: {
                  //   value: true,
                  //   message: 'Please enter employer name.'
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
              <ErrorMessage message={errors?.employerName?.message} />
            </div>
          </div>
        </div>
        <div className='text_wrap_row d-flex'>
          <div className='form_group d-flex flex-wrap align-items-center  pe-3'>
            <label className='me-2'>
              Applicant Signature <RedStar />
            </label>
            <div className='signature_pic'>
              <div className='position-relative me-3'>
                <InputGroup>
                  <Form.Control
                    type='text'
                    className='border-end-0'
                    name='image'
                    {...register('image', {
                      required: {
                        value: preview ? false : true,
                        message: 'Please select signature'
                      }
                    })}
                    accept='image/png, image/gif, image/jpeg'
                    placeholder={imageName || 'Upload'}
                    onClick={e => (e.target.value = null)}
                    disabled
                  />

                  <InputGroup.Text>
                    <img src='../../../images/upload.svg' alt='image' />
                  </InputGroup.Text>
                </InputGroup>

                <input
                  type='file'
                  name='image'
                  accept='image/png, image/jpeg, image/jpg'
                  ref={imageRef}
                  disabled={formView}
                  className='position-absolute top-0 left-0 opacity-0'
                  onChange={handleImgChange}
                  style={{ width: '100%', height: '100%' }}
                />
                <CropperModal
                  modalOpen={modalOpen}
                  src={src}
                  signature={false}
                  setImageData={setImageData}
                  setPreview={setPreview}
                  setModalOpen={setModalOpen}
                  setImageName={setImageName}
                />
                {errors?.image && (
                  <ErrorMessage message='Please select signature' />
                )}
              </div>
              {preview && handleObjectLength(currentFormItem.data) && (
                <figure className='upload-img'>
                  <img src={preview} alt='image' />
                </figure>
              )}
            </div>
          </div>
          <div className='form_group d-flex align-items-center mt-3'>
            <label className='me-2'>
              Date <RedStar />
            </label>
            <div className='position-relative'>
              <input
                type='date'
                disabled={formView}
                className='form_input'
                min={new Date().toISOString().split('T')[0]}
                {...register('createdAt', {
                  required: {
                    value: true,
                    message: 'Please enter date.'
                  }
                })}
              />
              <ErrorMessage message={errors?.createdAt?.message} />
            </div>
          </div>
        </div>
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

export default RequestForEmploymentForm
