import React, { useState, useEffect, useContext, useRef } from 'react'
import { useForm } from 'react-hook-form'
import ErrorMessage from '@/pages/components/ErrorMessage'
import { preventMaxInput, validationRules } from '@/utils/constants'
import RedStar from '@/pages/components/common/RedStar'
import AuthContext from '@/context/AuthContext'
import { InputGroup, Form } from 'react-bootstrap'
import apiPath from '@/utils/pathObj'
import { apiPost, apiPut } from '@/utils/apiFetch'
import useToastContext from '@/hooks/useToastContext'
import { useRouter } from 'next/router'
import CropperModal from '@/pages/components/CropperModal'
import Helpers from '@/utils/helpers'

const EmployeeApplicationForm = ({
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
    { label: 'Part time', value: false },
    { label: 'Full Time', value: false }
  ])
  const [checkboxesPhone, setCheckboxesPhone] = useState([
    { label: 'Home Phone', value: false },
    { label: 'Alternate Phone', value: false }
  ])
  const [checkboxesLicense, setCheckboxesLicense] = useState([
    { label: 'Yes', value: false },
    { label: 'No', value: false }
  ])
  const [checkboxesCDL, setCheckboxesCDL] = useState([
    { label: 'Yes', value: false },
    { label: 'No', value: false }
  ])
  const [checkboxesEducation, setCheckboxesEducation] = useState([
    { label: 'High School', value: false },
    { label: 'GED', value: false },
    { label: 'College 0-3 yrs', value: false }
  ])
  const [checkboxesDegree, setCheckboxesDegree] = useState([
    { label: 'Assoc', value: false },
    { label: 'BAchelor', value: false },
    { label: 'Masters', value: false }
  ])
  const [checkboxesContact, setCheckboxesContact] = useState([
    { label: 'Yes', value: false },
    { label: 'No', value: false }
  ])
  const [checkboxesEmployer, setCheckboxesEmployer] = useState([
    { label: 'Yes', value: false },
    { label: 'No', value: false }
  ])
  const [checkboxesEmployment, setCheckboxesEmployment] = useState([
    { label: 'Yes', value: false },
    { label: 'No', value: false }
  ])
  const [checkboxesEssential, setCheckboxesEssential] = useState([
    { label: 'Yes', value: false },
    { label: 'No', value: false }
  ])
  const [checkboxesDuties, setCheckboxesDuties] = useState([
    { label: 'Yes', value: false },
    { label: 'No', value: false }
  ])
  const [checkboxesName, setCheckboxesName] = useState([
    { label: 'Yes', value: false },
    { label: 'No', value: false }
  ])
  const [checkboxesRelatives, setCheckboxesRelatives] = useState([
    { label: 'Yes', value: false },
    { label: 'No', value: false }
  ])
  const [checkboxesMilitary, setCheckboxesMilitary] = useState([
    { label: 'Yes', value: false },
    { label: 'No', value: false }
  ])
  const [checkboxesTraffic, setCheckboxesTraffic] = useState([
    { label: 'Yes', value: false },
    { label: 'No', value: false }
  ])
  const onSubmit = async data => {
    try {
      const phone = checkboxesPhone?.find(i => i.value === true)?.label
      if (phone === 'Home Phone') delete data.alternatePhone
      if (phone === 'Alternate Phone') delete data.homePhone
      data.employmentDesired = Helpers.orCondition(
        checkboxes?.find(i => i.value === true)?.label,
        ''
      )
      data.homePhones = Helpers.orCondition(
        checkboxesPhone?.find(i => i.value === true)?.label,
        ''
      )
      data.alternatePhones = Helpers.orCondition(
        checkboxesPhone?.find(i => i.value === true)?.label,
        ''
      )
      data.driverLicense = Helpers.orCondition(
        checkboxesLicense?.find(i => i.value === true)?.label,
        ''
      )
      data.CDL = Helpers.orCondition(
        checkboxesCDL?.find(i => i.value === true)?.label,
        ''
      )
      data.education = Helpers.orCondition(
        checkboxesEducation?.find(i => i.value === true)?.label,
        ''
      )
      data.degree = Helpers.orCondition(
        checkboxesDegree?.find(i => i.value === true)?.label,
        ''
      )
      data.contact = Helpers.orCondition(
        checkboxesContact?.find(i => i.value === true)?.label,
        ''
      )
      data.employer = Helpers.orCondition(
        checkboxesEmployer?.find(i => i.value === true)?.label,
        ''
      )
      data.employment = Helpers.orCondition(
        checkboxesEmployment?.find(i => i.value === true)?.label,
        ''
      )
      data.explainAccommodation = Helpers.orCondition(
        checkboxesEssential?.find(i => i.value === true)?.label,
        ''
      )
      data.explainDuties = Helpers.orCondition(
        checkboxesDuties?.find(i => i.value === true)?.label,
        ''
      )
      data.employeeExplain = Helpers.orCondition(
        checkboxesName?.find(i => i.value === true)?.label,
        ''
      )
      data.employeeRelativeName = Helpers.orCondition(
        checkboxesRelatives?.find(i => i.value === true)?.label,
        ''
      )
      data.militaryLang = Helpers.orCondition(
        checkboxesMilitary?.find(i => i.value === true)?.label,
        ''
      )
      data.violance = Helpers.orCondition(
        checkboxesTraffic?.find(i => i.value === true)?.label,
        ''
      )
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
  const handleCheckboxPhone = index => {
    let checkboxPhone = [...checkboxesPhone]
    checkboxPhone?.map(i => (i.value = false))
    checkboxPhone[index].value = !checkboxPhone[index].value
    setCheckboxesPhone(checkboxPhone)
  }
  const handleCheckboxLicense = index => {
    let checkboxLicense = [...checkboxesLicense]
    checkboxLicense?.map(i => (i.value = false))
    checkboxLicense[index].value = !checkboxLicense[index].value
    setCheckboxesLicense(checkboxLicense)
  }
  const handleCheckboxCDL = index => {
    let checkboxCDL = [...checkboxesCDL]
    checkboxCDL?.map(i => (i.value = false))
    checkboxCDL[index].value = !checkboxCDL[index].value
    setCheckboxesCDL(checkboxCDL)
  }
  const handleCheckboxEducation = index => {
    let checkboxEducation = [...checkboxesEducation]
    checkboxEducation?.map(i => (i.value = false))
    checkboxEducation[index].value = !checkboxEducation[index].value
    setCheckboxesEducation(checkboxEducation)
  }
  const handleCheckboxDegree = index => {
    let checkboxDegree = [...checkboxesDegree]
    checkboxDegree?.map(i => (i.value = false))
    checkboxDegree[index].value = !checkboxDegree[index].value
    setCheckboxesDegree(checkboxDegree)
  }
  const handleCheckboxContact = index => {
    let checkboxContact = [...checkboxesContact]
    checkboxContact?.map(i => (i.value = false))
    checkboxContact[index].value = !checkboxContact[index].value
    setCheckboxesContact(checkboxContact)
  }
  const handleCheckboxEmployer = index => {
    let checkboxEmployer = [...checkboxesEmployer]
    checkboxEmployer?.map(i => (i.value = false))
    checkboxEmployer[index].value = !checkboxEmployer[index].value
    setCheckboxesEmployer(checkboxEmployer)
  }
  const handleCheckboxEmployment = index => {
    let checkboxEmployment = [...checkboxesEmployment]
    checkboxEmployment?.map(i => (i.value = false))
    checkboxEmployment[index].value = !checkboxEmployment[index].value
    setCheckboxesEmployment(checkboxEmployment)
  }
  const handleCheckboxEssential = index => {
    let checkboxEssential = [...checkboxesEssential]
    checkboxEssential?.map(i => (i.value = false))
    checkboxEssential[index].value = !checkboxEssential[index].value
    setCheckboxesEssential(checkboxEssential)
  }
  const handleCheckboxDuties = index => {
    let checkboxDuties = [...checkboxesDuties]
    checkboxDuties?.map(i => (i.value = false))
    checkboxDuties[index].value = !checkboxDuties[index].value
    setCheckboxesDuties(checkboxDuties)
  }
  const handleCheckboxName = index => {
    let checkboxName = [...checkboxesName]
    checkboxName?.map(i => (i.value = false))
    checkboxName[index].value = !checkboxName[index].value
    setCheckboxesName(checkboxName)
  }
  const handleCheckboxRelative = index => {
    let checkboxRelative = [...checkboxesRelatives]
    checkboxRelative?.map(i => (i.value = false))
    checkboxRelative[index].value = !checkboxRelative[index].value
    setCheckboxesRelatives(checkboxRelative)
  }
  const handleCheckboxMilitary = index => {
    let checkboxMilitary = [...checkboxesMilitary]
    checkboxMilitary?.map(i => (i.value = false))
    checkboxMilitary[index].value = !checkboxMilitary[index].value
    setCheckboxesMilitary(checkboxMilitary)
  }
  const handleCheckboxTraffic = index => {
    let checkboxTraffic = [...checkboxesTraffic]
    checkboxTraffic?.map(i => (i.value = false))
    checkboxTraffic[index].value = !checkboxTraffic[index].value
    setCheckboxesTraffic(checkboxTraffic)
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
    if (Object.keys(currentFormItem.data || {})?.length) {
      commonFunction(
        checkboxes,
        setCheckboxes,
        currentFormItem?.data?.employmentDesired
      )
      commonFunction(
        checkboxesPhone,
        setCheckboxesPhone,
        currentFormItem?.data?.homePhones
      )
      commonFunction(
        checkboxesPhone,
        setCheckboxesPhone,
        currentFormItem?.data?.alternatePhones
      )
      commonFunction(
        checkboxesLicense,
        setCheckboxesLicense,
        currentFormItem?.data?.driverLicense
      )
      commonFunction(
        checkboxesCDL,
        setCheckboxesCDL,
        currentFormItem?.data?.CDL
      )
      commonFunction(
        checkboxesEducation,
        setCheckboxesEducation,
        currentFormItem?.data?.education
      )
      commonFunction(
        checkboxesDegree,
        setCheckboxesDegree,
        currentFormItem?.data?.degree
      )
      commonFunction(
        checkboxesContact,
        setCheckboxesContact,
        currentFormItem?.data?.contact
      )
      commonFunction(
        checkboxesEmployer,
        setCheckboxesEmployer,
        currentFormItem?.data?.employer
      )
      commonFunction(
        checkboxesEmployment,
        setCheckboxesEmployment,
        currentFormItem?.data?.employment
      )
      commonFunction(
        checkboxesEssential,
        setCheckboxesEssential,
        currentFormItem?.data?.explainAccommodation
      )
      commonFunction(
        checkboxesDuties,
        setCheckboxesDuties,
        currentFormItem?.data?.explainDuties
      )
      commonFunction(
        checkboxesName,
        setCheckboxesName,
        currentFormItem?.data?.employeeExplain
      )
      commonFunction(
        checkboxesRelatives,
        setCheckboxesRelatives,
        currentFormItem?.data?.employeeRelativeName
      )
      commonFunction(
        checkboxesMilitary,
        setCheckboxesMilitary,
        currentFormItem?.data?.militaryLang
      )
      commonFunction(
        checkboxesTraffic,
        setCheckboxesTraffic,
        currentFormItem?.data?.violance
      )
      setFileImage(currentFormItem.data?.image)
      reset(currentFormItem?.data)
      setValue('image', '')
    }
  }, [currentFormItem?.data])

  const handleObjectLength = obj => Object.keys(obj || {})?.length > 0

  return (
    <div>
      <div className='employee_application_form py-3'>
        <div className='similar_wrapper'>
          <div className='employee_application_form_wrap'>
            <h2>Employee Application</h2>
            <div className='text_wrap_row text-center text-dark bg-light'>
              <strong className='text-lg'>
                {acceptedJobs?.Company?.name} is a drug free workplace
              </strong>
            </div>

            <div className='text_wrap_row text-center text-dark'>
              <strong className='d-block'>Position Desired</strong>
              <em className='text-sm'>Applicant Must Complete</em>
            </div>

            <div className='text_wrap_row d-flex align-items-center justify-content-between'>
              <div className='form_group d-flex align-items-center'>
                <label className='me-2'>
                  Position Desired: <RedStar />
                </label>
                <div className='position-relative'>
                  <input
                    type='text'
                    disabled={formView}
                    className='form_input'
                    maxLength={15}
                    onInput={e => preventMaxInput(e, 15)}
                    {...register('positionDesired', {
                      required: {
                        value: true,
                        message: 'Please enter position desired.'
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
                  <ErrorMessage message={errors?.positionDesired?.message} />
                </div>
              </div>

              <div className='form_group d-flex align-items-center'>
                <label className='me-2'>Date Available:</label>
                <div className='position-relative'>
                  <input
                    type='date'
                    className='form_input'
                    disabled={formView}
                    min={new Date().toISOString().split('T')[0]}
                    {...register('AvailDate', {
                      // required: {
                      //   value: true,
                      //   message: 'Please enter date.'
                      // }
                    })}
                  />
                  {/* <ErrorMessage message={errors?.AvailDate?.message} /> */}
                </div>
              </div>
            </div>

            <div className='text_wrap_row d-flex align-items-center'>
              <strong className='me-5'>Type of Employment Desired:</strong>
              {checkboxes?.map((item, index) => (
                <>
                  <label className='me-5'>
                    {item?.label}
                    <input
                      type='checkbox'
                      className='me-0 ms-2'
                      disabled={formView}
                      checked={item?.value}
                      onChange={() => handleCheckboxChange(index)}
                    />
                  </label>
                </>
              ))}
            </div>

            <div className='text_wrap_row text-dark text-center bg-light'>
              <strong className='d-block'>Personal Information</strong>
              <strong>
                Please note: Print in ink or type. Complete all sections.
              </strong>
            </div>
            <div className='text_wrap_row d-flex align-items-center justify-content-between'>
              <div className='form_group d-flex align-items-center'>
                <label className='me-2'>
                  First Name: <RedStar />
                </label>
                <div className='position-relative'>
                  <input
                    type='text'
                    disabled={formView}
                    className='form_input'
                    maxLength={15}
                    onInput={e => preventMaxInput(e, 15)}
                    {...register('firstName', {
                      required: {
                        value: true,
                        message: 'Please enter first name.'
                      },
                      minLength: {
                        value: 2,
                        message: 'Minimum length must be 2.'
                      },
                      maxLength: {
                        value: 15,
                        message: 'Maximum length must be 15.'
                      },
                      pattern: {
                        value: validationRules.characters,
                        message: validationRules.charactersMessage
                      }
                    })}
                  />
                  <ErrorMessage message={errors?.firstName?.message} />
                </div>
              </div>
              <div className='form_group d-flex align-items-center'>
                <label className='me-2'>
                  Last Name: <RedStar />
                </label>
                <div className='position-relative'>
                  <input
                    type='text'
                    disabled={formView}
                    className='form_input'
                    maxLength={15}
                    onInput={e => preventMaxInput(e, 15)}
                    {...register('lastName', {
                      required: {
                        value: true,
                        message: 'Please enter last name.'
                      },
                      minLength: {
                        value: 2,
                        message: 'Minimum length must be 2.'
                      },
                      maxLength: {
                        value: 15,
                        message: 'Maximum length must be 15.'
                      },
                      pattern: {
                        value: validationRules.characters,
                        message: validationRules.charactersMessage
                      }
                    })}
                  />
                  <ErrorMessage message={errors?.lastName?.message} />
                </div>
              </div>

              <div className='form_group d-flex align-items-center'>
                <label className='me-2'>
                  M.I. <RedStar />
                </label>
                <div className='position-relative'>
                  <input
                    type='text'
                    disabled={formView}
                    className='form_input'
                    maxLength={15}
                    onInput={e => preventMaxInput(e, 15)}
                    {...register('mi', {
                      required: {
                        value: true,
                        message: 'Please enter mi.'
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
                  <ErrorMessage message={errors?.mi?.message} />
                </div>
              </div>
            </div>

            <div className='text_wrap_row d-flex align-items-center justify-content-between'>
              <div className='form_group d-flex align-items-center'>
                <label className='me-2'>
                  Street Address: <RedStar />
                </label>
                <div className='position-relative'>
                  <input
                    type='text'
                    disabled={formView}
                    className='form_input'
                    maxLength={50}
                    onInput={e => preventMaxInput(e, 50)}
                    {...register('address', {
                      required: {
                        value: true,
                        message: 'Please enter street address.'
                      },
                      minLength: {
                        value: 2,
                        message: 'Minimum length must be 2.'
                      },
                      maxLength: {
                        value: 50,
                        message: 'Maximum length must be 50.'
                      }
                    })}
                  />
                  <ErrorMessage message={errors?.address?.message} />
                </div>
              </div>
              <div className='form_group d-flex align-items-center'>
                <label className='me-2'>
                  City: <RedStar />
                </label>
                <div className='position-relative'>
                  <input
                    type='text'
                    disabled={formView}
                    className='form_input'
                    maxLength={15}
                    onInput={e => preventMaxInput(e, 15)}
                    {...register('city', {
                      required: {
                        value: true,
                        message: 'Please enter city.'
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
                  <ErrorMessage message={errors?.city?.message} />
                </div>
              </div>

              <div className='form_group d-flex align-items-center'>
                <label className='me-2'>
                  State/Zip <RedStar />
                </label>
                <div className='position-relative'>
                  <input
                    type='text'
                    disabled={formView}
                    className='form_input'
                    maxLength={15}
                    onInput={e => preventMaxInput(e, 15)}
                    {...register('zip', {
                      required: {
                        value: true,
                        message: 'Please enter state/zip.'
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
                  <ErrorMessage message={errors?.zip?.message} />
                </div>
              </div>
            </div>

            <div className='text_wrap_row'>
              <div className='d-flex align-items-center'>
                {checkboxesPhone?.slice(0, 1)?.map((item, index) => (
                  <>
                    <label className='me-3'>
                      {item?.label}
                      <input
                        type='checkbox'
                        className='me-0 ms-2 align-middle'
                        disabled={formView}
                        checked={item?.value}
                        onChange={() => handleCheckboxPhone(index)}
                      />
                    </label>
                  </>
                ))}
                <label className='me-5'>
                  {checkboxesPhone[1]?.label}
                  <input
                    type='checkbox'
                    className='me-0 ms-2 align-middle'
                    disabled={formView}
                    checked={checkboxesPhone[1]?.value}
                    onChange={() => {
                      handleCheckboxPhone(1)
                    }}
                  />
                </label>
                {checkboxesPhone[0]?.value && (
                  <div className='form_group d-flex align-items-center ps-3'>
                    <div className='position-relative'>
                      <input
                        type='number'
                        className='form_input'
                        placeholder='Home phone'
                        disabled={formView}
                        maxLength={10}
                        onInput={e => preventMaxInput(e, 10)}
                        {...register('homePhone', {
                          required: {
                            value: true,
                            message: 'Please enter home phone.'
                          },
                          minLength: {
                            value: 10,
                            message: 'Minimum length must be 10.'
                          }
                        })}
                      />
                      <ErrorMessage message={errors?.homePhone?.message} />
                    </div>
                  </div>
                )}
                {checkboxesPhone[1]?.value && (
                  <div className='form_group d-flex align-items-center ps-3'>
                    <div className='position-relative'>
                      <input
                        type='number'
                        className='form_input'
                        placeholder='Alternate phone'
                        disabled={formView}
                        maxLength={10}
                        onInput={e => preventMaxInput(e, 10)}
                        {...register('alternatePhone', {
                          required: {
                            value: true,
                            message: 'Please enter alternate phone.'
                          },
                          minLength: {
                            value: 10,
                            message: 'Minimum length must be 10.'
                          }
                        })}
                      />
                      <ErrorMessage message={errors?.alternatePhone?.message} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className='text_wrap_row'>
              <div className='form_group d-flex align-items-center'>
                <label className='me-2'>
                  E-mail Address: <RedStar />
                </label>
                <div className='position-relative flex-grow-1'>
                  <input
                    type='text'
                    disabled={formView}
                    className='form_input w-100'
                    onInput={e => preventMaxInput(e)}
                    {...register('email', {
                      required: 'Please enter email address.',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address.'
                      }
                    })}
                  />
                  <ErrorMessage message={errors?.email?.message} />
                </div>
              </div>
            </div>

            <div className='text_wrap_row d-flex align-items-center'>
              <div className='text-cols d-flex align-items-center'>
                <strong className='me-3'>
                  Do you have a valid Driver’s License?
                </strong>
                {checkboxesLicense?.map((item, index) => (
                  <>
                    <label className='me-4'>
                      {item?.label}
                      <input
                        type='checkbox'
                        className='me-0 ms-2'
                        disabled={formView}
                        checked={item?.value}
                        onChange={() => handleCheckboxLicense(index)}
                      />
                    </label>
                  </>
                ))}
              </div>
              <div className='text-cols d-flex align-items-center ps-4'>
                <strong className='me-5'>Class:</strong>
                <strong className='me-5'>CDL?</strong>
                {checkboxesCDL?.map((item, index) => (
                  <>
                    <label className='me-5'>
                      {item?.label}
                      <input
                        type='checkbox'
                        className='me-0 ms-2'
                        disabled={formView}
                        checked={item?.value}
                        onChange={() => handleCheckboxCDL(index)}
                      />
                    </label>
                  </>
                ))}
              </div>
            </div>

            <div className='text_wrap_row d-flex align-items-center'>
              <strong className='me-5' style={{ maxWidth: '364px' }}>
                Do you have relatives working for {acceptedJobs?.Company?.name}?{' '}
              </strong>
              {checkboxesEmployer?.slice(0, 1)?.map((item, index) => (
                <>
                  <label className='me-5'>
                    {item?.label}
                    <input
                      type='checkbox'
                      className='me-0 ms-2'
                      disabled={formView}
                      checked={item?.value}
                      onChange={() => handleCheckboxEmployer(index)}
                    />
                  </label>
                </>
              ))}
              <label className='me-5'>
                {checkboxesEmployer[1]?.label}
                <input
                  type='checkbox'
                  className='me-0 ms-2'
                  disabled={formView}
                  checked={checkboxesEmployer[1]?.value}
                  onChange={() => {
                    handleCheckboxEmployer(1)
                  }}
                />
              </label>
              {checkboxesEmployer[0]?.value && (
                <div className='form_group d-flex align-items-center ps-3'>
                  <label className='me-2'>If Yes- Employee’s Name</label>
                  <div className='position-relative'>
                    <input
                      type='text'
                      className='form_input'
                      disabled={formView}
                      maxLength={15}
                      onInput={e => preventMaxInput(e, 15)}
                      {...register('employeeName', {
                        required: {
                          value: true,
                          message: 'Please enter employer name.'
                        },
                        minLength: {
                          value: 2,
                          message: 'Minimum length must be 2.'
                        }
                      })}
                    />
                    <ErrorMessage message={errors?.employeeName?.message} />
                  </div>
                </div>
              )}
            </div>

            <div className='text_wrap_row d-flex align-items-center'>
              <strong className='me-5' style={{ maxWidth: '364px' }}>
                Have you ever served in the military?
              </strong>
              {checkboxesMilitary?.slice(0, 1)?.map((item, index) => (
                <>
                  <label className='me-5'>
                    {item?.label}
                    <input
                      type='checkbox'
                      className='me-0 ms-2'
                      disabled={formView}
                      checked={item?.value}
                      onChange={() => handleCheckboxMilitary(index)}
                    />
                  </label>
                </>
              ))}
              <label className='me-5'>
                {checkboxesMilitary[1]?.label}
                <input
                  type='checkbox'
                  className='me-0 ms-2'
                  disabled={formView}
                  checked={checkboxesMilitary[1]?.value}
                  onChange={() => {
                    handleCheckboxMilitary(1)
                  }}
                />
              </label>
              {checkboxesMilitary[0]?.value && (
                <div className='form_group d-flex align-items-center ps-3'>
                  <label className='me-2'>
                    Do you speak any other language(s)? Specify{' '}
                  </label>
                  <input
                    type='text'
                    className='form_input'
                    disabled={formView}
                    maxLength={15}
                    onInput={e => preventMaxInput(e, 15)}
                    {...register('specifyLang', {
                      required: {
                        value: true,
                        message: 'Please enter specify.'
                      },
                      minLength: {
                        value: 2,
                        message: 'Minimum length must be 2.'
                      }
                    })}
                  />
                  <ErrorMessage message={errors?.specifyLang?.message} />
                </div>
              )}
            </div>

            <div className='text_wrap_row d-flex align-items-center'>
              <strong className='me-5'>
                Do you have the legal right to obtain employment in the United
                States?
              </strong>
              {checkboxesEmployment?.map((item, index) => (
                <>
                  <label className='me-5'>
                    {item?.label}
                    <input
                      type='checkbox'
                      className='me-0 ms-2'
                      disabled={formView}
                      checked={item?.value}
                      onChange={() => handleCheckboxEmployment(index)}
                    />
                  </label>
                </>
              ))}
            </div>

            <div className='text_wrap_row d-flex align-items-center'>
              <strong className='me-5' style={{ maxWidth: '394px' }}>
                Can you perform the essential functions and responsibilities of
                the position for which you are applying?
              </strong>
              {checkboxesEssential?.slice(0, 1)?.map((item, index) => (
                <>
                  <label className='me-5'>
                    {item?.label}
                    <input
                      type='checkbox'
                      className='me-0 ms-2'
                      disabled={formView}
                      checked={item?.value}
                      onChange={() => handleCheckboxEssential(index)}
                    />
                  </label>
                </>
              ))}
              <label className='me-5'>
                {checkboxesEssential[1]?.label}
                <input
                  type='checkbox'
                  className='me-0 ms-2'
                  disabled={formView}
                  checked={checkboxesEssential[1]?.value}
                  onChange={() => {
                    handleCheckboxEssential(1)
                  }}
                />
              </label>
              {checkboxesEssential[1]?.value && (
                <div className='form_group d-flex align-items-center ps-5'>
                  <label className='me-2'> If not, explain:</label>
                  <div className='position-relative'>
                    <input
                      type='text'
                      className='form_input'
                      disabled={formView}
                      maxLength={15}
                      onInput={e => preventMaxInput(e, 15)}
                      {...register('explainAccommodations', {
                        required: {
                          value: true,
                          message: 'Please enter explain.'
                        },
                        minLength: {
                          value: 2,
                          message: 'Minimum length must be 2.'
                        }
                      })}
                    />
                    <ErrorMessage
                      message={errors?.explainAccommodations?.message}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className='text_wrap_row d-flex align-items-center'>
              <strong className='me-5' style={{ maxWidth: '394px' }}>
                Do you require any special accomodation to perform required
                duties?
              </strong>
              {checkboxesDuties?.slice(0, 1)?.map((item, index) => (
                <>
                  <label className='me-5'>
                    {item?.label}
                    <input
                      type='checkbox'
                      className='me-0 ms-2'
                      disabled={formView}
                      checked={item?.value}
                      onChange={() => handleCheckboxDuties(index)}
                    />
                  </label>
                </>
              ))}
              <label className='me-5'>
                {checkboxesDuties[1]?.label}
                <input
                  type='checkbox'
                  className='me-0 ms-2'
                  disabled={formView}
                  checked={checkboxesDuties[1]?.value}
                  onChange={() => {
                    handleCheckboxDuties(1)
                  }}
                />
              </label>
              {checkboxesDuties[1]?.value && (
                <div className='form_group d-flex align-items-center ps-5'>
                  <label className='me-2'>If not, explain</label>
                  <div className='position-relative'>
                    <input
                      type='text'
                      className='form_input'
                      disabled={formView}
                      maxLength={15}
                      onInput={e => preventMaxInput(e, 15)}
                      {...register('explainDuty', {
                        required: {
                          value: true,
                          message: 'Please enter explain.'
                        },
                        minLength: {
                          value: 2,
                          message: 'Minimum length must be 2.'
                        }
                      })}
                    />
                    <ErrorMessage message={errors?.explainDuty?.message} />
                  </div>
                </div>
              )}
            </div>

            <div className='text_wrap_row d-flex align-items-center'>
              <strong className='me-5'>
                Have you ever worked for {acceptedJobs?.Company?.name} ?
              </strong>
              {checkboxesName?.slice(0, 1)?.map((item, index) => (
                <>
                  <label className='me-5'>
                    {item?.label}
                    <input
                      type='checkbox'
                      className='me-0 ms-2'
                      disabled={formView}
                      checked={item?.value}
                      onChange={() => handleCheckboxName(index)}
                    />
                  </label>
                </>
              ))}
              <label className='me-5'>
                {checkboxesName[1]?.label}
                <input
                  type='checkbox'
                  className='me-0 ms-2'
                  disabled={formView}
                  checked={checkboxesName[1]?.value}
                  onChange={() => {
                    handleCheckboxName(1)
                  }}
                />
              </label>
              {checkboxesName[0]?.value && (
                <div className='form_group d-flex align-items-center ps-5'>
                  <label className='me-2'>If yes, explain:</label>
                  <div className='position-relative'>
                    <input
                      type='text'
                      className='form_input'
                      disabled={formView}
                      maxLength={15}
                      onInput={e => preventMaxInput(e, 15)}
                      {...register('explainEmployee', {
                        required: {
                          value: true,
                          message: 'Please enter explain.'
                        },
                        minLength: {
                          value: 2,
                          message: 'Minimum length must be 2.'
                        }
                      })}
                    />
                    <ErrorMessage message={errors?.explainEmployee?.message} />
                  </div>
                </div>
              )}
            </div>

            <div className='text_wrap_row d-flex align-items-center'>
              <div className='text-cols d-flex align-items-center pe-3'>
                <strong className='me-5' style={{ maxWidth: '320px' }}>
                  Do any of your relatives work for for [Employer Name] ?
                </strong>
                {checkboxesRelatives?.slice(0, 1)?.map((item, index) => (
                  <>
                    <label className='me-5'>
                      {item?.label}
                      <input
                        type='checkbox'
                        className='me-0 ms-2'
                        disabled={formView}
                        checked={item?.value}
                        onChange={() => handleCheckboxRelative(index)}
                      />
                    </label>
                  </>
                ))}
                <label className='me-5'>
                  {checkboxesRelatives[1]?.label}
                  <input
                    type='checkbox'
                    className='me-0 ms-2'
                    disabled={formView}
                    checked={checkboxesRelatives[1]?.value}
                    onChange={() => {
                      handleCheckboxRelative(1)
                    }}
                  />
                </label>
              </div>
              {checkboxesRelatives[0]?.value && (
                <div className='text-cols d-flex align-items-center'>
                  <div className='form_group d-flex align-items-center'>
                    <strong className='pe-3'>for?</strong>
                    <label className='me-2'>If Yes, State their name</label>
                    <div className='position-relative'>
                      <input
                        type='text'
                        className='form_input'
                        disabled={formView}
                        maxLength={15}
                        onInput={e => preventMaxInput(e, 15)}
                        {...register('relativeName', {
                          required: {
                            value: true,
                            message: 'Please enter name.'
                          },
                          minLength: {
                            value: 2,
                            message: 'Minimum length must be 2.'
                          }
                        })}
                      />
                      <ErrorMessage message={errors?.relativeName?.message} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className='text_wrap_row d-flex align-items-center'>
              <p>
                List any current licenses, certifications, or registrations
                required for the position for which you are applying. Include
                date received.
              </p>
            </div>

            <div className='text_wrap_row d-flex flex-wrap align-items-center'>
              <strong className='me-5'>
                Have you ever been convicted of any criminal or driving
                offense(s) other than a minor traffic violation?
              </strong>
              <div className='form_group'>
                <div className='d-flex'>
                  {checkboxesTraffic?.slice(0, 1)?.map((item, index) => (
                    <>
                      <label className='me-2'>
                        {item?.label}
                        <input
                          type='checkbox'
                          className='me-0 ms-2'
                          disabled={formView}
                          checked={item?.value}
                          onChange={() => handleCheckboxTraffic(index)}
                        />
                      </label>
                    </>
                  ))}
                  <label className='me-5'>
                    {checkboxesTraffic[1]?.label}
                    <input
                      type='checkbox'
                      className='me-0 ms-2'
                      disabled={formView}
                      checked={checkboxesTraffic[1]?.value}
                      onChange={() => {
                        handleCheckboxTraffic(1)
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
            {checkboxesTraffic[0]?.value && (
              <>
                <label className='mt-0'>
                  If yes, written documentation must be provided about criminal
                  offenses from the clerk of court in the county in which the
                  conviction was made, and about any driving offenses other than
                  minor traffic violations from the motor vehicles office.
                </label>
                <div className='text_wrap_row d-flex flex-wrap align-items-center border-0'>
                  <strong className='me-5 mb-2'>
                    Have you ever been convicted of any criminal or driving
                    offense(s) other than a minor traffic violation?
                  </strong>

                  <div className='input_row w-100'>
                    <div className='input_field d-flex mb-2'>
                      <span className='me-2'>1.</span>
                      <input
                        type='text'
                        className='form_input flex-grow-1'
                        disabled={formView}
                        maxLength={100}
                        onInput={e => preventMaxInput(e, 100)}
                        {...register('drivingOffense', {
                          // required: {
                          //   value: true,
                          //   message: 'Please enter minor traffic violation.'
                          // },
                          minLength: {
                            value: 2,
                            message: 'Minimum length must be 2.'
                          },
                          maxLength: {
                            value: 100,
                            message: 'Maximum length must be 100.'
                          }
                        })}
                      />
                    </div>

                    <div className='input_field d-flex mb-2'>
                      <span className='me-2'>2.</span>
                      <input
                        type='text'
                        className='form_input flex-grow-1'
                        disabled={formView}
                        maxLength={100}
                        onInput={e => preventMaxInput(e, 100)}
                        {...register('drivingOffense1', {
                          // required: {
                          //   value: true,
                          //   message: 'Please enter minor traffic violation.'
                          // },
                          minLength: {
                            value: 2,
                            message: 'Minimum length must be 2.'
                          },
                          maxLength: {
                            value: 100,
                            message: 'Maximum length must be 100.'
                          }
                        })}
                      />
                    </div>

                    <div className='input_field d-flex mb-2'>
                      <span className='me-2'>3.</span>
                      <input
                        type='text'
                        className='form_input flex-grow-1'
                        disabled={formView}
                        maxLength={100}
                        onInput={e => preventMaxInput(e, 100)}
                        {...register('drivingOffense2', {
                          // required: {
                          //   value: true,
                          //   message: 'Please enter minor traffic violation.'
                          // },
                          minLength: {
                            value: 2,
                            message: 'Minimum length must be 2.'
                          },
                          maxLength: {
                            value: 100,
                            message: 'Maximum length must be 100.'
                          }
                        })}
                      />
                    </div>
                    <ErrorMessage message={errors?.drivingOffense?.message} />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Education & Skills */}

          <div className='employee_application_form_wrap mt-4'>
            <div className='text_wrap_row text-center text-dark bg-light '>
              <strong className='text-lg'>Education & Skills</strong>
            </div>

            <div className='text_wrap_row border-0'>
              <div className='text-cols d-flex align-items-center'>
                <strong className='me-4'>Level of education completed:</strong>
                {checkboxesEducation?.map((item, index) => (
                  <>
                    <label className='me-4'>
                      {item?.label}
                      <input
                        type='checkbox'
                        className='me-0 ms-2'
                        disabled={formView}
                        checked={item?.value}
                        onChange={() => handleCheckboxEducation(index)}
                      />
                    </label>
                  </>
                ))}
              </div>
            </div>

            <div className='text_wrap_row'>
              <div className='text-cols d-flex align-items-center'>
                <strong className='me-4'>Degree :</strong>
                {checkboxesDegree?.map((item, index) => (
                  <>
                    <label className='me-4'>
                      {item?.label}
                      <input
                        type='checkbox'
                        className='me-0 ms-2'
                        disabled={formView}
                        checked={item?.value}
                        onChange={() => handleCheckboxDegree(index)}
                      />
                    </label>
                  </>
                ))}
              </div>
            </div>

            <div className='text_wrap_row border px-3'>
              <div className='text-cols d-flex  justify-content-between align-items-center'>
                <strong className='d-block'>Personal Information</strong>
                <div className='form_group d-flex align-items-center'>
                  <label className='me-2'>Date Available:</label>
                  <div className='position-relative'>
                    <input
                      type='date'
                      disabled={formView}
                      className='form_input'
                      min={new Date().toISOString().split('T')[0]}
                      {...register('dateAvail', {
                        // required: {
                        //   value: true,
                        //   message: 'Please enter date.'
                        // }
                      })}
                    />
                    {/* <ErrorMessage message={errors?.dateAvail?.message} /> */}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Experience */}

          <div className='employee_application_form_wrap mt-4'>
            <div className='text_wrap_row text-center text-dark bg-light'>
              <strong className='text-lg d-block'>Experience</strong>
              <span>List last 5 years of work experience</span>
            </div>

            <div className='text_wrap_row'>
              <div className='d-flex mb-3'>
                <div className='form_group d-flex align-items-center pe-4'>
                  <label className='me-2'>From:</label>
                  <div className='position-relative'>
                    <input
                      type='date'
                      className='form_input'
                      disabled={formView}
                      //min={new Date().toISOString().split('T')[0]}
                      {...register('createdAt', {
                        // required: {
                        //   value: true,
                        //   message: 'Please enter from.'
                        // }
                      })}
                    />
                    {/* <ErrorMessage message={errors?.createdAt?.message} /> */}
                  </div>
                </div>

                <div className='form_group d-flex align-items-center'>
                  <label className='me-2'>To:</label>
                  <div className='position-relative'>
                    <input
                      type='date'
                      className='form_input'
                      disabled={formView}
                      //min={new Date().toISOString().split('T')[0]}
                      {...register('updatedAt', {
                        // required: {
                        //   value: true,
                        //   message: 'Please enter to.'
                        // }
                      })}
                    />
                    {/* <ErrorMessage message={errors?.updatedAt?.message} /> */}
                  </div>
                </div>
              </div>
              <div className='d-flex'>
                <div className='amount_cls me-4'>
                  <strong>Beginning Salary </strong>
                  <input
                    type='number'
                    disabled={formView}
                    className='form_input'
                    {...register('beginningSalary', {
                      // required: {
                      //   value: true,
                      //   message: 'Please enter beginning salary.'
                      // },
                      minLength: {
                        value: 2,
                        message: 'Minimum length must be 2.'
                      }
                    })}
                  />
                  <ErrorMessage message={errors?.beginningSalary?.message} />
                  {/* <span>$456</span> */}
                </div>
                <div className='amount_cls'>
                  <strong>Ending Salary </strong>
                  <input
                    type='number'
                    disabled={formView}
                    className='form_input'
                    {...register('endingSalary', {
                      // required: {
                      //   value: true,
                      //   message: 'Please enter ending salary.'
                      // },
                      minLength: {
                        value: 2,
                        message: 'Minimum length must be 2.'
                      }
                    })}
                  />
                  <ErrorMessage message={errors?.endingSalary?.message} />
                </div>
              </div>
            </div>

            <div className='text_wrap_row d-flex align-items-center'>
              <div className='form_group d-flex align-items-center pe-4 mb-0'>
                <label className='me-2'>
                  Name of Employer <RedStar />
                </label>
                <div className='position-relative for_error_msg'>
                  <input
                    type='text'
                    disabled={formView}
                    className='form_input'
                    maxLength={15}
                    onInput={e => preventMaxInput(e, 15)}
                    {...register('employerName', {
                      required: {
                        value: true,
                        message: 'Please enter employer name.'
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
                  <ErrorMessage message={errors?.employerName?.message} />
                </div>
              </div>
              <div className=' d-flex align-items-center'>
                <strong className='me-5'>May we contact?</strong>
                {checkboxesContact?.map((item, index) => (
                  <>
                    <label className='me-5'>
                      {item?.label}
                      <input
                        type='checkbox'
                        className='me-0 ms-2'
                        disabled={formView}
                        checked={item?.value}
                        onChange={() => handleCheckboxContact(index)}
                      />
                    </label>
                  </>
                ))}
              </div>
            </div>

            <div className='text_wrap_row d-flex align-items-center justify-content-between'>
              <div className='form_group d-flex align-items-center pe-4'>
                <label className='me-2'>
                  Address: <RedStar />
                </label>
                <div className='position-relative'>
                  <input
                    type='text'
                    disabled={formView}
                    className='form_input'
                    maxLength={50}
                    onInput={e => preventMaxInput(e, 50)}
                    {...register('employeeAddress', {
                      required: {
                        value: true,
                        message: 'Please enter address.'
                      },
                      minLength: {
                        value: 2,
                        message: 'Minimum length must be 2.'
                      }
                    })}
                  />
                  <ErrorMessage message={errors?.employeeAddress?.message} />
                </div>
              </div>

              <div className='form_group d-flex align-items-center pe-4'>
                <label className='me-2'>
                  City: <RedStar />
                </label>
                <div className='position-relative'>
                  <input
                    type='text'
                    disabled={formView}
                    className='form_input'
                    maxLength={15}
                    onInput={e => preventMaxInput(e, 15)}
                    {...register('employeeCity', {
                      required: {
                        value: true,
                        message: 'Please enter city.'
                      },
                      minLength: {
                        value: 2,
                        message: 'Minimum length must be 2.'
                      }
                    })}
                  />
                  <ErrorMessage message={errors?.employeeCity?.message} />
                </div>
              </div>

              <div className='form_group d-flex align-items-center pe-4'>
                <label className='me-2'>
                  State/Zip: <RedStar />
                </label>
                <div className='position-relative'>
                  <input
                    type='text'
                    disabled={formView}
                    className='form_input'
                    maxLength={15}
                    onInput={e => preventMaxInput(e, 15)}
                    {...register('employeeZip', {
                      required: {
                        value: true,
                        message: 'Please enter state/zip.'
                      },
                      minLength: {
                        value: 2,
                        message: 'Minimum length must be 2.'
                      }
                    })}
                  />
                  <ErrorMessage message={errors?.employeeZip?.message} />
                </div>
              </div>
            </div>

            <div className='d-flex'>
              <div className='text_wrap_row d-flex align-items-center justify-content-between border-0'>
                <div className='form_group d-flex align-items-center pe-4 w-100'>
                  <label className='me-2'>
                    Title and Duties Performed: <RedStar />
                  </label>
                  <div className='position-relative'>
                    <input
                      type='text'
                      disabled={formView}
                      className='form_input flex-grow-1'
                      maxLength={15}
                      onInput={e => preventMaxInput(e, 15)}
                      {...register('titleDuties', {
                        required: {
                          value: true,
                          message: 'Please enter title and duties performed.'
                        },
                        minLength: {
                          value: 2,
                          message: 'Minimum length must be 2.'
                        }
                      })}
                    />
                    <ErrorMessage message={errors?.titleDuties?.message} />
                  </div>
                </div>
              </div>

              <div className='text_wrap_row d-flex align-items-center justify-content-between border-0'>
                <div className='form_group d-flex align-items-center pe-4 w-100'>
                  <label className='me-2'>
                    Reason for Leaving: <RedStar />
                  </label>
                  <div className='position-relative'>
                    <input
                      type='text'
                      disabled={formView}
                      className='form_input flex-grow-1'
                      maxLength={50}
                      onInput={e => preventMaxInput(e, 50)}
                      {...register('reasonForLeaving', {
                        required: {
                          value: true,
                          message: 'Please enter reason for leaving.'
                        },
                        minLength: {
                          value: 2,
                          message: 'Minimum length must be 2.'
                        }
                      })}
                    />
                    <ErrorMessage message={errors?.reasonForLeaving?.message} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='employee_application_form_wrap mt-4'>
            <div className='text_wrap_row text-center text-dark bg-light'>
              <strong className='text-lg d-block'>Reason for Leaving:</strong>
            </div>

            <div className='text_wrap_row'>
              <p className='mb-2'>
                <em>
                  I understand that in processing my application with{' '}
                  {acceptedJobs?.Company?.name} an investigation may be made in
                  which information is obtained through personal interviews, and
                  a review of information held by law enforcement or other
                  government agencies. I authorize you to verify my past
                  employment and education, criminal records, motor vehicle
                  records, personal references, and other job-related data
                  provided on this application, or via the interview process. I
                  authorize appropriate individuals, companies, institutions, or
                  agencies to release information, and I release them from any
                  liability as a result of such inquires or disclosures. A
                  consumer report may be generated summarizing this information.
                </em>
              </p>

              <p className='mb-2'>
                <em>
                  I further understand and waive my right of privacy in this
                  investigation and release and hold harmless{' '}
                  {acceptedJobs?.Company?.name} from any liability. I agree that
                  any decision to hire me is contingent upon the results of my
                  report and certify that all statements and answers on my
                  application, resume, or interview are true and complete to the
                  best of my knowledge.
                </em>
              </p>
              <p className='mb-2'>
                <em>
                  I understand that if any statements are false or that if
                  information has been omitted, this will be cause for
                  disqualification and immediate termination of my employment.
                  If employed, I further authorize {acceptedJobs?.Company?.name}{' '}
                  to check my credit, conviction records, and other items listed
                  above as needed, on a continuous basis as it relates to my
                  employment. I am granting {acceptedJobs?.Company?.name}{' '}
                  authorization to release confidential medical information upon
                  the request from {acceptedJobs?.Company?.name} clients while I
                  am actively working at the client’s facility and /or during
                  the profiling, credentialing, and placement processes.
                </em>
              </p>
            </div>

            <div className='text_wrap_row form_footer d-flex align-content-between justify-content-between'>
              <strong>
                SIGNATURE OF APPLICANT <RedStar />
              </strong>

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
                    disabled={formView}
                    ref={imageRef}
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

              <div className='form_group d-flex align-items-center'>
                <label className='me-2'>Date:</label>
                <div className='position-relative'>
                  <input
                    type='date'
                    disabled={formView}
                    className='form_input'
                    min={new Date().toISOString().split('T')[0]}
                    {...register('leavingDate', {
                      // required: {
                      //   value: true,
                      //   message: 'Please enter date.'
                      // }
                    })}
                  />
                  {/* <ErrorMessage message={errors?.leavingDate?.message} /> */}
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
    </div>
  )
}

export default EmployeeApplicationForm
