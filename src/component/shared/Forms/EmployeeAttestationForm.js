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
import Helpers from '@/utils/helpers'

const EmployeeAttestationForm = ({
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

  const [checkboxes, setCheckboxes] = useState([
    { label: 'fully vaccinated / ', value: false },
    { label: 'partially vaccinated', value: false }
  ])
  const [checkboxesVaccine, setCheckboxesVaccine] = useState([
    { label: 'Johnson & Johnson', value: false },
    { label: 'Moderna', value: false },
    { label: 'Pfizer-BioNTech', value: false },
    { label: 'Other', value: false }
  ])

  const onSubmit = async data => {
    try {
      data.vaccinationStatus = Helpers.orCondition(
        checkboxes?.find(i => i.value === true)?.label,
        ''
      )
      data.covidVaccinationStatus =
        checkboxesVaccine?.find(i => i.value === true)?.label || ''
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

  const handleCheckboxChange = index => {
    let checkbox = [...checkboxes]
    checkbox?.map(i => (i.value = false))
    checkbox[index].value = !checkbox[index].value
    setCheckboxes(checkbox)
  }
  const handleCheckboxVaccine = index => {
    let checkboxCovid = [...checkboxesVaccine]
    checkboxCovid?.map(i => (i.value = false))
    checkboxCovid[index].value = !checkboxCovid[index].value
    setCheckboxesVaccine(checkboxCovid)
  }

  const commonFunction = (check, setState, value) => {
    let checkBox = [...check]
    const i = checkBox.findIndex(item => item.label === value)
    if (i !== -1) checkBox[i].value = true
    setState(checkBox)
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
      commonFunction(
        checkboxes,
        setCheckboxes,
        currentFormItem?.data?.vaccinationStatus
      )
      commonFunction(
        checkboxesVaccine,
        setCheckboxesVaccine,
        currentFormItem?.data?.covidVaccinationStatus
      )
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
              Employee Attestation of COVID-19 Vaccination Status
            </strong>
          </div>

          <p className='d-flex flex-wrap'>
            I,{' '}
            <div className='position-relative'>
              <input
                type='text'
                className='form_input mb-2'
                disabled={formView}
                maxLength={15}
                onInput={e => preventMaxInput(e, 15)}
                {...register('attest', {
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
              />{' '}
              <ErrorMessage message={errors?.attest?.message} />
            </div>{' '}
            attest that I am{' '}
            {checkboxes?.map((item, index) => (
              <>
                <Form.Check
                  type='checkbox'
                  label={item.label}
                  id='check1'
                  name='group1'
                  className='radio_btn mx-2'
                  disabled={formView}
                  checked={item?.value}
                  onChange={() => handleCheckboxChange(index)}
                />
              </>
            ))}
            against COVID-19 and am unable to produce proof of vaccination.{' '}
          </p>
          <p>
            I understand fully vaccinated to mean two weeks (14 days) have
            passed since receiving either a one-dose vaccine or a second dose of
            a two-dose vaccine; and partially vaccinated means a second dose
            must still be obtained and/or two weeks have not passed since my
            final dose.{' '}
          </p>
          <p>Type of vaccination received: </p>
          {checkboxesVaccine?.slice(0, 3)?.map((item, index) => (
            <>
              <Form.Check
                type='checkbox'
                label={item.label}
                id='check1'
                name='group1'
                className='radio_btn mx-2 mb-2'
                disabled={formView}
                checked={item?.value}
                onChange={() => handleCheckboxVaccine(index)}
              />
            </>
          ))}
          <div className='d-flex align-items-center mb-4'>
            <Form.Check
              type='checkbox'
              label={checkboxesVaccine[3]?.label}
              id='check1'
              disabled={formView}
              name='group1'
              className='radio_btn mx-2'
              onChange={() => {
                handleCheckboxVaccine(3)
              }}
            />
            {checkboxesVaccine[3]?.value && (
              <>
                <input
                  type='text'
                  className='form_input'
                  disabled={formView}
                  maxLength={15}
                  onInput={e => preventMaxInput(e, 15)}
                  {...register('other', {
                    required: {
                      value: true,
                      message: 'Please enter other.'
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
                <ErrorMessage message={errors?.other?.message} />
              </>
            )}
          </div>
          <Row className='gy-4'>
            <Col md={9}>
              <label htmlFor='' className='m-0'>
                Dates of vaccine administration: First dose:{' '}
              </label>
              <input
                type='date'
                className='form_input w-100'
                disabled={formView}
                min={new Date().toISOString().split('T')[0]}
                {...register('firstDoseDate', {
                  // required: {
                  //   value: true,
                  //   message: 'Please enter first dose.'
                  // }
                })}
              />
              {/* <ErrorMessage message={errors?.firstDoseDate?.message} /> */}
            </Col>
            <Col md={3}>
              <label htmlFor='' className='m-0'>
                Second dose
              </label>
              <input
                type='date'
                className='form_input w-100'
                disabled={formView}
                min={new Date().toISOString().split('T')[0]}
                {...register('secondDoseDate', {
                  // required: {
                  //   value: true,
                  //   message: 'Please enter second dose.'
                  // }
                })}
              />
              {/* <ErrorMessage message={errors?.secondDoseDate?.message} /> */}
            </Col>
            <Col md={12}>
              <label htmlFor='' className='m-0'>
                Name of health care professional or clinic administering the
                vaccine:
              </label>
              <input
                type='text'
                className='form_input w-100'
                disabled={formView}
                maxLength={15}
                onInput={e => preventMaxInput(e, 15)}
                {...register('healthName', {
                  // required: {
                  //   value: true,
                  //   message: 'Please enter name of health care professional.'
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
              <ErrorMessage message={errors?.healthName?.message} />
            </Col>
            <Col md={12}>
              <label htmlFor='' className='mt-0'>
                Additional comments: <RedStar />
              </label>
              <textarea
                name=''
                className='form-control'
                id=''
                cols='30'
                rows='3'
                disabled={formView}
                maxLength={15}
                onInput={e => preventMaxInput(e, 15)}
                {...register('additionalComments', {
                  required: {
                    value: true,
                    message: 'Please enter additional comments.'
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
              ></textarea>
              <ErrorMessage message={errors?.additionalComments?.message} />
            </Col>
            <Col md={12}>
              <p className='text-dark'>
                I declare [or certify, verify, or state] that this statement
                about my vaccination status is true and accurate. I understand
                that knowingly providing false information regarding my
                vaccination status on this form may subject me to criminal
                penalties.
              </p>
            </Col>
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
              <input
                type='date'
                className='form_input w-100'
                disabled={formView}
                min={new Date().toISOString().split('T')[0]}
                {...register('createdAt', {
                  required: {
                    value: true,
                    message: 'Please enter date.'
                  }
                })}
              />
              <ErrorMessage message={errors?.createdAt?.message} />
            </Col>
            <Col md={6}>
              <label htmlFor='' className='m-0'>
                Print Name <RedStar />
              </label>
              <input
                type='text'
                className='form_input w-100'
                disabled={formView}
                maxLength={15}
                onInput={e => preventMaxInput(e, 15)}
                {...register('printName', {
                  required: {
                    value: true,
                    message: 'Please enter print name.'
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
              <ErrorMessage message={errors?.printName?.message} />
            </Col>
          </Row>
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
  )
}

export default EmployeeAttestationForm
