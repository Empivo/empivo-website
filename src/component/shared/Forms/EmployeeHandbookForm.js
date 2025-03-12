import React, { useState, useEffect, useContext, useRef } from 'react'
import { useForm } from 'react-hook-form'
import ErrorMessage from '@/pages/components/ErrorMessage'
import { preventMaxInput } from '@/utils/constants'
import { Form, Row, Col, InputGroup } from 'react-bootstrap'
import AuthContext from '@/context/AuthContext'
import apiPath from '@/utils/pathObj'
import { apiPost, apiPut } from '@/utils/apiFetch'
import useToastContext from '@/hooks/useToastContext'
import { useRouter } from 'next/router'
import CropperModal from '@/pages/components/CropperModal'
import RedStar from '@/pages/components/common/RedStar'

const EmployeeHandbookForm = ({
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
    clearErrors,
    setValue,
    formState: { errors }
  } = useForm()
  const notification = useToastContext()
  const { acceptedJobs, currentFormItem, setCurrentItem } =
    useContext(AuthContext)
  const router = useRouter()

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
    <div className='employee_application_form py-3'>
      <div className='similar_wrapper text-dark'>
        <div className='employee_application_form_wrap'>
          <div className='text_wrap_row text-center text-dark bg-light mb-4'>
            <strong className='text-lg'>
              Employee Handbook Receipt Acknowledgment
            </strong>
          </div>
          <p>
            The employee handbook describes important information about{' '}
            {acceptedJobs?.Company?.name}, and I understand that I should
            consult human resources regarding any questions not answered in the
            handbook. I have entered into my employment relationship with{' '}
            {acceptedJobs?.Company?.name} voluntarily and acknowledge that there
            is no specified length of employment.{' '}
            <b>
              Accordingly, either I or {acceptedJobs?.Company?.name} can
              terminate the relationship at will, with or without cause, at any
              time, so long as there is not violation of applicable federal or
              state law.
            </b>
          </p>
          <p>
            I understand and agree that no manager, supervisor, or
            representative of {acceptedJobs?.Company?.name} has any authority to
            enter into any agreement for employment other than at-will. Only the
            President of the company has the authority to make any such
            agreement and then only in writing signed by the President of{' '}
            {acceptedJobs?.Company?.name}.
          </p>
          <p>
            This manual and the policies and procedures contained herein
            supersede any and all prior practices, oral or written
            representations, or statements regarding the terms and conditions of
            your employment with {acceptedJobs?.Company?.name}. By distributing
            this handbook,
            {acceptedJobs?.Company?.name} expressly revokes any and all previous
            policies and procedures which are inconsistent with those contained
            herein.
          </p>
          <p>
            I understand that, except for employment at-will status, any and all
            policies and practices may be changed at any time by{' '}
            {acceptedJobs?.Company?.name}, and the company reserves the right to
            change my hours, wages and working conditions at any time. All such
            changes will be communicated through official notices, and I
            understand that revised information may supersede, modify, or
            eliminate existing policies.{' '}
          </p>
          <p>
            <b>
              I understand and agree that nothing in the employee handbook
              creates, or is intended to create, a promise or representation of
              continued employment and that employment at{' '}
              {acceptedJobs?.Company?.name} is employment at-will, which may be
              terminated at the will of either {acceptedJobs?.Company?.name} or
              myself. Furthermore, I acknowledge that this handbook is neither a
              contract of employment nor a legal document.
            </b>{' '}
            I understand and agree that employment and compensation may be
            terminated with or without cause and with or without notice at any
            time by {acceptedJobs?.Company?.name} or myself.{' '}
          </p>
          <p>
            I have received the handbook, and I understand that it is my
            responsibility to read and comply with the policies contained in
            this handbook and any revisions made to it.
          </p>
          <Row className='gy-4 mb-4'>
            <Col md={12}>
              <label htmlFor='Name' className='m-0'>
                Employees signature: <RedStar />
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
                    <ErrorMessage message='Please select signature.' />
                  )}
                </div>
                {preview && handleObjectLength(currentFormItem.data) && (
                  <figure className='upload-img'>
                    <img src={preview} alt='image' />
                  </figure>
                )}
              </div>
            </Col>
            <Col md={12}>
              <label htmlFor='Name' className='m-0'>
                Employees name (print): <RedStar />
              </label>
              <input
                type='text'
                className='form_input w-50'
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
                    message: 'Minimum length must be 15.'
                  }
                })}
              />
              <ErrorMessage message={errors?.employeeName?.message} />
            </Col>
            <Col md={12}>
              <label htmlFor='Name' className='m-0'>
                Date: <RedStar />
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
            </Col>
          </Row>

          <h6 className='text-center text-dark fw-bold'>
            TO BE PLACED IN EMPLOYEES PERSONNEL FILE{' '}
          </h6>
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
          <div className='d-flex pt-4 change_direction'>
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
    </div>
  )
}

export default EmployeeHandbookForm
