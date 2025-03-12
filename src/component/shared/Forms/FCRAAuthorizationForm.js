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

const FCRAAuthorizationForm = ({
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
      <form onSubmit={handleSubmit(onSubmit)} method='post'>
        <div className='similar_wrapper text-dark'>
          <div className='employee_application_form_wrap'>
            <div className='text_wrap_row text-center text-dark bg-light mb-4'>
              <strong className='text-lg'>
                FCRA Authorization to Obtain a Consumer Report
                (Background/Credit Check)
              </strong>
            </div>
            <p>
              Pursuant to the federal Fair Credit Reporting Act, I hereby
              authorize {acceptedJobs?.Company?.name} and its designated agents
              and representatives to conduct a comprehensive review of my
              background through a consumer report and/or an investigative
              consumer report to be generated for employment, promotion,
              reassignment, or retention as an employee. I understand that the
              scope of the consumer report/investigative consumer report may
              include, but is not limited to, the following areas: verification
              of Social Security number; current and previous residences;
              employment history, including all personnel files; education;
              references; credit history and reports; criminal history,
              including records from any criminal justice agency in any or all
              federal, state or county jurisdictions; birth records; motor
              vehicle records, including traffic citations and registration; and
              any other public records.
            </p>
            <p>
              I,{' '}
              <input
                type='text'
                className='form_input'
                disabled={formView}
                maxLength={15}
                onInput={e => preventMaxInput(e, 15)}
                {...register('authorize', {
                  // required: {
                  //   value: true,
                  //   message: 'Please enter.'
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
              <ErrorMessage message={errors?.authorize?.message} />, authorize
              the complete release of these records or data pertaining to me
              that an individual, company, firm, corporation, or public agency
              may have. I hereby authorize and request any present or former
              employer, school, police department, financial institution or
              other persons that have personal knowledge of me to furnish{' '}
              {acceptedJobs?.Company?.name} or its designated agents with any
              and all information in their possession regarding me in connection
              with an application of employment. I am authorizing that a
              photocopy of this authorization be accepted with the same
              authority as the original.
            </p>
            <p>
              I understand that, pursuant to the federal Fair Credit Reporting
              Act, if any adverse action is to be taken based upon the consumer
              report, a copy of the report and a summary of the consumer’s
              rights will be provided to me.
            </p>

            <Row className='gy-4 mt-4'>
              <Col md={6}>
                <label htmlFor='' className='m-0'>
                  Signature <RedStar />
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
              <Col md={6}>
                <label htmlFor='' className='m-0'>
                  Date <RedStar />
                </label>
                <div className='position-relative'>
                  <input
                    type='date'
                    disabled={formView}
                    className='form_input w-100'
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
                <button className='btn theme_md_btn text-white'> Submit</button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default FCRAAuthorizationForm
