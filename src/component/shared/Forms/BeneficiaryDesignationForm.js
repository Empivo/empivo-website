import React, { useState, useEffect, useContext, useRef } from 'react'
import { useForm } from 'react-hook-form'
import ErrorMessage from '@/pages/components/ErrorMessage'
import { preventMaxInput } from '@/utils/constants'
import AuthContext from '@/context/AuthContext'
import apiPath from '@/utils/pathObj'
import { apiPost, apiPut } from '@/utils/apiFetch'
import useToastContext from '@/hooks/useToastContext'
import SignPage from '@/pages/components/SignPage'
import RedStar from '@/pages/components/common/RedStar'
import dayjs from 'dayjs'
import ODatePicker from '@/pages/components/common/ODatePicker'
import { useRouter } from 'next/router'

const BeneficiaryDesignationForm = ({
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

  const [expiryFrom, setExpiryFrom] = useState()
  const [dateErrors, setDateErrors] = useState({
    startDate: ''
  })

  const [preview, setPreview] = useState({
    employeeSign: null,
    spouseSign: null
  })
  const [src, setSrc] = useState(null)
  const [imageName, setImageName] = useState({
    employeeSign: null,
    spouseSign: null
  })
  const [imageData, setImageData] = useState({
    employeeSign: null,
    spouseSign: null
  })
  const [modalOpen, setModalOpen] = useState({
    employeeSign: false,
    spouseSign: false
  })
  const imageRef1 = useRef(null)
  const imageRef2 = useRef(null)

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

  const handleKeyDown = event => {
    if (
      !['Backspace', 'Delete', 'Tab'].includes(event.key) &&
      !/[0-9.]/.test(event.key)
    ) {
      event.preventDefault()
    }
  }

  const preventMaxHundred = e => {
    if (e.target.value > 100) {
      e.target.value = e.target.value.slice(0, 2)
    }
  }

  const validateFunc = () => {
    if (!expiryFrom) {
      setDateErrors({
        startDate: 'Please select dob.'
      })
      return false
    } else {
      setDateErrors({
        ...dateErrors,
        startDate: ''
      })
    }
    setDateErrors({})
    return true
  }

  const handleDateChange = start => {
    setExpiryFrom(dayjs(start).toDate())
  }
  useEffect(() => {
    if (dateErrors.startDate) {
      validateFunc()
    }
  }, [expiryFrom])
  const onSubmit = async data => {
    try {
      const isValidD = validateFunc()
      if (!isValidD) return
      data.dob = expiryFrom
      let payload = {
        jobID: acceptedJobs?.Job?._id,
        companyID: acceptedJobs?.companyID,
        formType: formCategoryType,
        content: {
          ...data,
          employeeSign: JSON.stringify({
            employeeSign: imageData.employeeSign
          }),
          spouseSign: JSON.stringify({ spouseSign: imageData.spouseSign })
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

  const setFileImage = async (text1, image1, text2, image2) => {
    if (image1 && image2) {
      const imageData1 = JSON.parse(image1)[text1]
      const imageData2 = JSON.parse(image2)[text2]
      setPreview({
        [text1]: imageData1,
        [text2]: imageData2
      })
      setImageData({
        [text1]: imageData1,
        [text2]: imageData2
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
      setExpiryFrom(currentFormItem.data?.dob)
      setFileImage(
        'employeeSign',
        currentFormItem.data?.employeeSign,
        'spouseSign',
        currentFormItem.data?.spouseSign
      )
      reset(currentFormItem.data)
      setValue('employeeSign', '')
      setValue('spouseSign', '')
    }
  }, [currentFormItem.data])

  const handleObjectLength = obj => Object.keys(obj || {})?.length

  return (
    <div>
      <div className='employee_application_form py-3'>
        <div className='employee_application_form py-3'>
          <div className='similar_wrapper'>
            <div className='employee_application_form_wrap'>
              <div className='text_wrap_row text-center text-dark bg-light p-3'>
                <strong className='text-dark text-lg d-block'>
                  Beneficiary Designation Form
                </strong>
                <em>(Please print clearly)</em>
              </div>

              <div className='text_wrap_row d-flex align-items-center '>
                <div className='form_group d-flex align-items-center flex-grow-1'>
                  <label className='me-2'>Today’s date:</label>
                  <div className='position-relative flex-grow-1 pe-3'>
                    <input
                      type='date'
                      disabled={formView}
                      className='form_input w-100'
                      min={new Date().toISOString().split('T')[0]}
                      {...register('createdAt', {
                        // required: {
                        //   value: true,
                        //   message: 'Please enter date.'
                        // }
                      })}
                    />
                    {/* <ErrorMessage message={errors?.createdAt?.message} /> */}
                  </div>
                </div>

                <div className='form_group d-flex align-items-center flex-grow-1'>
                  <label className='me-2'>
                    Employee name: <RedStar />
                  </label>
                  <div className='position-relative flex-grow-1 pe-3'>
                    <input
                      type='text'
                      disabled={formView}
                      className='form_input w-100'
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
                </div>
              </div>
              <div className='text_wrap_row d-flex align-items-center flex-wrap'>
                <div className='form_group d-flex align-items-center flex-grow-1'>
                  <label className='me-2'>
                    Social Security number (SSN): <RedStar />
                  </label>
                  <div className='position-relative flex-grow-1 pe-3'>
                    <input
                      type='number'
                      disabled={formView}
                      className='form_input w-100'
                      maxLength={4}
                      onKeyDown={event => handleKeyDown(event)}
                      {...register('securityNumber', {
                        required: {
                          value: true,
                          message: 'Please enter social security number.'
                        },
                        minLength: {
                          value: 4,
                          message: 'Minimum length must be 4.'
                        }
                      })}
                    />
                    <ErrorMessage message={errors?.securityNumber?.message} />
                  </div>
                </div>

                <div className='form_group d-flex align-items-center flex-grow-1'>
                  {/* <label className='me-2'>DOB:</label> */}
                  <div className='w-100'>
                    <ODatePicker
                      handleDateChange={handleDateChange}
                      disabled={formView}
                      expiryFrom={currentFormItem.data?.dob}
                      addFlex={false}
                      errors={dateErrors}
                    />
                  </div>
                </div>

                {/* <div className='form_group d-flex align-items-center'>
                  <label className='me-2'>
                    Date of birth (mm/dd/yyyy): <RedStar />
                  </label>
                  <div className='position-relative flex-grow-1 pe-3'>
                    <input
                      type='date'
                      disabled={formView}
                      className='form_input w-100'
                      min={new Date().toISOString().split('T')[0]}
                      {...register('dob', {
                        required: {
                          value: true,
                          message: 'Please enter dob.'
                        }
                      })}
                    />
                    <ErrorMessage message={errors?.dob?.message} />
                  </div>
                </div> */}
              </div>
              <div className='form_group d-flex align-items-center flex-grow-1'>
                <label className='me-2'>
                  Address: <RedStar />
                </label>
                <div className='position-relative flex-grow-1 pe-3'>
                  <input
                    type='text'
                    disabled={formView}
                    className='form_input w-100'
                    maxLength={15}
                    onInput={e => preventMaxInput(e, 15)}
                    {...register('address', {
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
                  <ErrorMessage message={errors?.address?.message} />
                </div>
              </div>

              <div className='form_group d-flex align-items-center flex-grow-1'>
                <label className='me-2'>
                  City, State, ZIP Code: <RedStar />
                </label>
                <div className='position-relative flex-grow-1 pe-3'>
                  <input
                    type='text'
                    disabled={formView}
                    className='form_input w-100'
                    maxLength={15}
                    onInput={e => preventMaxInput(e, 15)}
                    {...register('city', {
                      required: {
                        value: true,
                        message: 'Please enter city, state, ZIP code.'
                      },
                      minLength: {
                        value: 2,
                        message: 'Minimum length must be 2.'
                      }
                    })}
                  />
                  <ErrorMessage message={errors?.city?.message} />
                </div>
              </div>

              <div className='text_wrap_row d-flex align-items-center flex-wrap'>
                <div className='form_group d-flex align-items-center flex-grow-1 pe-3'>
                  <label className='me-2'>
                    Phone number: <RedStar />
                  </label>
                  <div className='position-relative flex-grow-1 pe-3'>
                    <input
                      type='number'
                      className='form_input w-100'
                      disabled={formView}
                      maxLength={10}
                      onInput={e => preventMaxInput(e, 10)}
                      {...register('phoneNumber', {
                        required: {
                          value: true,
                          message: 'Please enter phone number.'
                        },
                        minLength: {
                          value: 10,
                          message: 'Minimum length must be 10.'
                        }
                      })}
                    />
                    <ErrorMessage message={errors?.phoneNumber?.message} />
                  </div>
                </div>
                <div className='form_group d-flex align-items-center flex-grow-1'>
                  <label className='me-2'>
                    Email address: <RedStar />{' '}
                  </label>
                  <div className='position-relative flex-grow-1 pe-3'>
                    <input
                      type='email'
                      className='form_input w-100'
                      disabled={formView}
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

              <div className='text_wrap_row'>
                <strong>
                  I hereby designate the person(s) named below as
                  beneficiary(ies) for the following benefit plans, revoking any
                  previous beneficiary designation.
                </strong>
                <div className='mb-2'>
                  <em>Initial applicable plans:</em>
                </div>
                <div className='d-flex'>
                  <div className='form_group d-flex align-items-center w-50 pe-3'>
                    <label className='me-2'>Phone number:</label>
                    <input
                      type='number'
                      className='form_input w-100'
                      disabled={formView}
                      maxLength={10}
                      onInput={e => preventMaxInput(e, 10)}
                      {...register('phoneNumber1', {
                        // required: {
                        //   value: true,
                        //   message: 'Please enter phone number.'
                        // },
                        minLength: {
                          value: 10,
                          message: 'Minimum length must be 10.'
                        }
                      })}
                    />
                    <ErrorMessage message={errors?.phoneNumber1?.message} />
                  </div>
                  <div className='form_group d-flex align-items-center w-50'>
                    <label className='me-2'>Email address: </label>
                    <div className='position-relative flex-grow-1 pe-3'>
                      <input
                        type='email'
                        className='form_input w-100'
                        disabled={formView}
                        onInput={e => preventMaxInput(e)}
                        {...register('emailAddress', {
                          // required: 'Please enter email address.',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address.'
                          }
                        })}
                      />
                      <ErrorMessage message={errors?.emailAddress?.message} />
                    </div>
                  </div>
                </div>

                <div className='d-flex'>
                  <div className='form_group d-flex align-items-center w-50 pe-3'>
                    <label className='me-2'>Life insurance </label>
                    <div className='position-relative flex-grow-1 pe-3'>
                      <input
                        type='date'
                        disabled={formView}
                        className='form_input w-100'
                        min={new Date().toISOString().split('T')[0]}
                        {...register('lifeInsurance', {
                          // required: {
                          //   value: true,
                          //   message: 'Please enter life insurance.'
                          // }
                        })}
                      />
                      {/* <ErrorMessage message={errors?.lifeInsurance?.message} /> */}
                    </div>
                  </div>

                  <div className='form_group d-flex align-items-center w-50 pe-3'>
                    <label className='me-2'>Supplemental life insurance</label>
                    <div className='position-relative flex-grow-1 pe-3'>
                      <input
                        type='date'
                        disabled={formView}
                        className='form_input w-100'
                        min={new Date().toISOString().split('T')[0]}
                        {...register('supplemental', {
                          // required: {
                          //   value: true,
                          //   message: 'Please enter supplemental life insurance.'
                          // }
                        })}
                      />
                      {/* <ErrorMessage message={errors?.supplemental?.message} /> */}
                    </div>
                  </div>
                </div>

                <div className='d-flex'>
                  <div className='form_group d-flex align-items-center w-50 pe-3'>
                    <label className='me-2'>401(k) plan</label>
                    <div className='position-relative flex-grow-1 pe-3'>
                      <input
                        type='date'
                        disabled={formView}
                        className='form_input w-100'
                        min={new Date().toISOString().split('T')[0]}
                        {...register('plan', {
                          // required: {
                          //   value: true,
                          //   message: 'Please enter 401(k) plan.'
                          // }
                        })}
                      />
                      {/* <ErrorMessage message={errors?.plan?.message} /> */}
                    </div>
                  </div>

                  <div className='form_group d-flex align-items-center w-50 pe-3'>
                    <label className='me-2'>
                      Employee stock ownership plan
                    </label>
                    <div className='position-relative flex-grow-1 pe-3'>
                      <input
                        type='date'
                        disabled={formView}
                        className='form_input w-100'
                        min={new Date().toISOString().split('T')[0]}
                        {...register('ownershipPlan', {
                          // required: {
                          //   value: true,
                          //   message: 'Please enter employee stock ownership plan.'
                          // }
                        })}
                      />
                      {/* <ErrorMessage message={errors?.ownershipPlan?.message} /> */}
                    </div>
                  </div>
                </div>

                <div className='text_wrap_row d-flex'>
                  <div className='form_group d-flex align-items-center pe-3'>
                    <label className='me-2'>
                      Employee Signature: <RedStar />
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
                      errors={
                        <ErrorMessage message='Please select employeeSign.' />
                      }
                    />
                  </div>
                  <div className='form_group d-flex align-items-center w-50'>
                    <label className='me-2'>Date:</label>
                    <div className='position-relative flex-grow-1 pe-3'>
                      <input
                        type='date'
                        disabled={formView}
                        className='form_input w-100'
                        min={new Date().toISOString().split('T')[0]}
                        {...register('date1', {
                          // required: {
                          //   value: true,
                          //   message: 'Please enter date.'
                          // }
                        })}
                      />
                      {/* <ErrorMessage message={errors?.date1?.message} /> */}
                    </div>
                  </div>
                </div>
              </div>

              <div className='text_wrap_row'>
                <strong className='d-block'>
                  Spousal Signature (if applicable)
                </strong>
                <em>
                  If you are married and name someone other than your spouse as
                  beneficiary, payment of benefits may be delayed or disputed
                  unless your spouse also signs this beneficiary designation.{' '}
                </em>
              </div>

              <div className='text_wrap_row d-flex'>
                <div className='form_group d-flex align-items-center w-50 pe-3'>
                  <label className='me-2'>
                    Spouse Signature: <RedStar />
                  </label>
                  <SignPage
                    imageName={imageName.spouseSign}
                    register={register('spouseSign', {
                      required: {
                        value: preview.spouseSign ? false : true,
                        message: 'Please select signature'
                      }
                    })}
                    imageRef={imageRef2}
                    handleImgChange={handleImgChange}
                    modalOpen={modalOpen}
                    formView={formView}
                    handleSave={handleSave}
                    src={src}
                    text={'spouseSign'}
                    image={preview?.spouseSign}
                    errorCond={errors?.spouseSign}
                    imageShow={handleObjectLength(currentFormItem.data)}
                    errors={
                      <ErrorMessage message='Please select spouseSign.' />
                    }
                  />
                </div>
                <div className='form_group d-flex align-items-center w-50'>
                  <label className='me-2'>
                    Date: <RedStar />
                  </label>
                  <div className='position-relative flex-grow-1 pe-3'>
                    <input
                      type='date'
                      disabled={formView}
                      className='form_input w-100'
                      min={new Date().toISOString().split('T')[0]}
                      {...register('date', {
                        required: {
                          value: true,
                          message: 'Please enter date.'
                        }
                      })}
                    />
                    <ErrorMessage message={errors?.date?.message} />
                  </div>
                </div>
              </div>

              <div className='text_wrap_row'>
                <strong classname='text-dark'>
                  Primary and Contingent Beneficiaries{' '}
                </strong>
                <p>
                  Proceeds are paid to primary surviving beneficiaries in equal
                  amounts unless otherwise indicated. Proceeds are paid to
                  contingent beneficiaries only when there are no surviving
                  primary beneficiaries. If you designate contingent
                  beneficiaries and do not designate percentages, proceeds are
                  paid to the surviving contingent beneficiaries in equal
                  amounts. Unless otherwise provided, the share of a beneficiary
                  who dies before the insured will be divided proportionately
                  among the surviving beneficiaries in the respective category
                  (primary or contingent).
                </p>

                <strong className='text-dark d-block'>
                  Primary Beneficiary Designation{' '}
                </strong>
                <em>*Total Primary Beneficiary Share % must equal 100%</em>

                <div className='mt-2'>
                  <div className='d-flex'>
                    <div className='form_group d-flex align-items-center w-50 pe-3'>
                      <label className='me-2'>
                        Full name (Last, First, Middle Initial):
                      </label>
                      <div className='position-relative flex-grow-1 pe-3'>
                        <input
                          type='text'
                          className='form_input w-100'
                          maxLength={15}
                          disabled={formView}
                          onInput={e => preventMaxInput(e, 15)}
                          {...register('fullName3', {
                            // required: {
                            //   value: true,
                            //   message: 'Please enter full name.'
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
                        <ErrorMessage message={errors?.fullName3?.message} />
                      </div>
                    </div>

                    <div className='form_group d-flex align-items-center w-50 pe-3'>
                      <label className='me-2'>Relationship:</label>
                      <div className='position-relative flex-grow-1 pe-3'>
                        <input
                          type='text'
                          className='form_input w-100'
                          disabled={formView}
                          maxLength={15}
                          onInput={e => preventMaxInput(e, 15)}
                          {...register('relationship3', {
                            // required: {
                            //   value: true,
                            //   message: 'Please enter relationship.'
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
                        <ErrorMessage
                          message={errors?.relationship3?.message}
                        />
                      </div>
                    </div>
                  </div>

                  <div className='d-flex'>
                    <div className='form_group d-flex align-items-center w-50 pe-3'>
                      <label className='me-2'>Date of birth: </label>
                      <div className='position-relative flex-grow-1 pe-3'>
                        <input
                          type='date'
                          disabled={formView}
                          className='form_input w-100'
                          //min={new Date().toISOString().split('T')[0]}
                          {...register('dob1', {
                            // required: {
                            //   value: true,
                            //   message: 'Please enter date of birth.'
                            // }
                          })}
                        />
                        {/* <ErrorMessage message={errors?.dob1?.message} /> */}
                      </div>
                    </div>

                    <div className='form_group d-flex align-items-center   pe-3'>
                      <label className='me-2'>
                        Address (Street, City, State, Zip):{' '}
                      </label>
                      <div className='position-relative flex-grow-1 pe-3'>
                        <input
                          type='text'
                          className='form_input w-100'
                          disabled={formView}
                          maxLength={15}
                          onInput={e => preventMaxInput(e, 15)}
                          {...register('street1', {
                            // required: {
                            //   value: true,
                            //   message: 'Please enter address.'
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
                        <ErrorMessage message={errors?.street1?.message} />
                      </div>
                    </div>
                  </div>

                  <div className='d-flex'>
                    <div className='form_group d-flex align-items-center pe-3'>
                      <label className='me-2'>Percentage: </label>
                      <div className='position-relative flex-grow-1 pe-3'>
                        <input
                          type='text'
                          disabled={formView}
                          className='form_input w-100'
                          onInput={e => preventMaxHundred(e)}
                          onKeyDown={event => handleKeyDown(event)}
                          {...register('percent3', {
                            // required: {
                            //   value: true,
                            //   message: 'Please enter percent.'
                            // },
                            pattern: {
                              value: /^\d+$/,
                              message: 'Only Digits Are Allowed.'
                            },
                            maxLength: {
                              value: 100,
                              message: 'Max limit is 100.'
                            },
                            min: {
                              value: 1,
                              message: 'Minimum value must is 1.'
                            }
                          })}
                        />
                        <ErrorMessage message={errors?.percent3?.message} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='text_wrap_row'>
                <div className='d-flex'>
                  <div className='form_group d-flex align-items-center w-50 pe-3'>
                    <label className='me-2'>
                      Full name (Last, First, Middle Initial):
                    </label>
                    <div className='position-relative flex-grow-1 pe-3'>
                      <input
                        type='text'
                        disabled={formView}
                        className='form_input w-100'
                        maxLength={15}
                        onInput={e => preventMaxInput(e, 15)}
                        {...register('fullName4', {
                          // required: {
                          //   value: true,
                          //   message: 'Please enter full name.'
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
                      <ErrorMessage message={errors?.fullName4?.message} />
                    </div>
                  </div>

                  <div className='form_group d-flex align-items-center w-50 pe-3'>
                    <label className='me-2'>Relationship:</label>
                    <div className='position-relative flex-grow-1 pe-3'>
                      <input
                        type='text'
                        className='form_input w-100'
                        disabled={formView}
                        maxLength={15}
                        onInput={e => preventMaxInput(e, 15)}
                        {...register('relationship4', {
                          // required: {
                          //   value: true,
                          //   message: 'Please enter relationship.'
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
                      <ErrorMessage message={errors?.relationship4?.message} />
                    </div>
                  </div>
                </div>

                <div className='d-flex'>
                  <div className='form_group d-flex align-items-center w-50 pe-3'>
                    <label className='me-2'>Date of birth: </label>
                    <div className='position-relative flex-grow-1 pe-3'>
                      <input
                        type='date'
                        disabled={formView}
                        className='form_input w-100'
                        //min={new Date().toISOString().split('T')[0]}
                        {...register('dob2', {
                          // required: {
                          //   value: true,
                          //   message: 'Please enter date of birth.'
                          // }
                        })}
                      />
                      {/* <ErrorMessage message={errors?.dob2?.message} /> */}
                    </div>
                  </div>

                  <div className='form_group d-flex align-items-center w-50 pe-3'>
                    <label className='me-2'>
                      Address (Street, City, State, Zip):{' '}
                    </label>
                    <div className='position-relative flex-grow-1 pe-3'>
                      <input
                        type='text'
                        className='form_input w-100'
                        disabled={formView}
                        maxLength={15}
                        onInput={e => preventMaxInput(e, 15)}
                        {...register('street2', {
                          // required: {
                          //   value: true,
                          //   message: 'Please enter address.'
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
                      <ErrorMessage message={errors?.street2?.message} />
                    </div>
                  </div>
                </div>

                <div className='d-flex'>
                  <div className='form_group d-flex align-items-center  pe-3'>
                    <label className='me-2'>Percentage: </label>
                    <div className='position-relative flex-grow-1 pe-3'>
                      <input
                        type='text'
                        className='form_input w-100'
                        disabled={formView}
                        onInput={e => preventMaxHundred(e)}
                        onKeyDown={event => handleKeyDown(event)}
                        {...register('percent4', {
                          // required: {
                          //   value: true,
                          //   message: 'Please enter percent.'
                          // },
                          pattern: {
                            value: /^\d+$/,
                            message: 'Only Digits Are Allowed.'
                          },
                          maxLength: {
                            value: 100,
                            message: 'Max limit is 100.'
                          },
                          min: {
                            value: 1,
                            message: 'Minimum value must is 1.'
                          }
                        })}
                      />
                      <ErrorMessage message={errors?.percent4?.message} />
                    </div>
                  </div>
                </div>
              </div>
              <div className='text_wrap_row'>
                <div className='d-flex'>
                  <div className='form_group d-flex align-items-center w-50 pe-3'>
                    <label className='me-2'>
                      Full name (Last, First, Middle Initial):
                    </label>
                    <div className='position-relative flex-grow-1 pe-3'>
                      <input
                        type='text'
                        className='form_input w-100'
                        maxLength={15}
                        onInput={e => preventMaxInput(e, 15)}
                        disabled={formView}
                        {...register('fullName2', {
                          // required: {
                          //   value: true,
                          //   message: 'Please enter full name.'
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
                      <ErrorMessage message={errors?.fullName2?.message} />
                    </div>
                  </div>

                  <div className='form_group d-flex align-items-center w-50 pe-3'>
                    <label className='me-2'>Relationship:</label>
                    <div className='position-relative flex-grow-1 pe-3'>
                      <input
                        type='text'
                        className='form_input w-100'
                        maxLength={15}
                        disabled={formView}
                        onInput={e => preventMaxInput(e, 15)}
                        {...register('relationship2', {
                          // required: {
                          //   value: true,
                          //   message: 'Please enter relationship.'
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
                      <ErrorMessage message={errors?.relationship2?.message} />
                    </div>
                  </div>
                </div>

                <div className='d-flex'>
                  <div className='form_group d-flex align-items-center w-50 pe-3'>
                    <label className='me-2'>Date of birth: </label>
                    <div className='position-relative flex-grow-1 pe-3'>
                      <input
                        type='date'
                        disabled={formView}
                        className='form_input w-100'
                        //min={new Date().toISOString().split('T')[0]}
                        {...register('dob3', {
                          // required: {
                          //   value: true,
                          //   message: 'Please enter date of birth.'
                          // }
                        })}
                      />
                      {/* <ErrorMessage message={errors?.dob3?.message} /> */}
                    </div>
                  </div>

                  <div className='form_group d-flex align-items-center w-50 pe-3'>
                    <label className='me-2'>
                      Address (Street, City, State, Zip):{' '}
                    </label>
                    <div className='position-relative flex-grow-1 pe-3'>
                      <input
                        type='text'
                        className='form_input w-100'
                        maxLength={15}
                        disabled={formView}
                        onInput={e => preventMaxInput(e, 15)}
                        {...register('streets', {
                          // required: {
                          //   value: true,
                          //   message: 'Please enter address.'
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
                      <ErrorMessage message={errors?.streets?.message} />
                    </div>
                  </div>
                </div>

                <div className='form_group d-flex align-items-center pe-3'>
                  <label className='me-2'>Percentage: </label>
                  <div className='position-relative  pe-3'>
                    <input
                      type='text'
                      className='form_input '
                      disabled={formView}
                      onInput={e => preventMaxHundred(e)}
                      onKeyDown={event => handleKeyDown(event)}
                      {...register('percent2', {
                        // required: {
                        //   value: true,
                        //   message: 'Please enter percent.'
                        // },
                        pattern: {
                          value: /^\d+$/,
                          message: 'Only Digits Are Allowed.'
                        },
                        maxLength: {
                          value: 100,
                          message: 'Max limit is 100.'
                        },
                        min: {
                          value: 1,
                          message: 'Minimum value must is 1.'
                        }
                      })}
                    />
                    <ErrorMessage message={errors?.percent2?.message} />
                  </div>
                </div>
              </div>
            </div>

            <div className='text_wrap_row'>
              <strong className='text-dark d-block'>
                Contingent Beneficiary Designation
              </strong>
              <em>*Total Contingent Beneficiary Share % must equal 100%</em>

              <div className='d-flex'>
                <div className='form_group d-flex align-items-center w-50 pe-3'>
                  <label className='me-2'>
                    Full name (Last, First, Middle Initial):
                  </label>
                  <div className='position-relative flex-grow-1 pe-3'>
                    <input
                      type='text'
                      className='form_input w-100'
                      disabled={formView}
                      maxLength={15}
                      onInput={e => preventMaxInput(e, 15)}
                      {...register('fullName1', {
                        // required: {
                        //   value: true,
                        //   message: 'Please enter full name.'
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
                    <ErrorMessage message={errors?.fullName1?.message} />
                  </div>
                </div>

                <div className='form_group d-flex align-items-center w-50 pe-3'>
                  <label className='me-2'>Relationship:</label>
                  <div className='position-relative flex-grow-1 pe-3'>
                    <input
                      type='text'
                      className='form_input w-100'
                      disabled={formView}
                      maxLength={15}
                      onInput={e => preventMaxInput(e, 15)}
                      {...register('relationship1', {
                        // required: {
                        //   value: true,
                        //   message: 'Please enter relationship.'
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
                    <ErrorMessage message={errors?.relationship1?.message} />
                  </div>
                </div>
              </div>

              <div className='d-flex'>
                <div className='form_group d-flex align-items-center w-50 pe-3'>
                  <label className='me-2'>Date of birth: </label>
                  <div className='position-relative flex-grow-1 pe-3'>
                    <input
                      type='date'
                      disabled={formView}
                      className='form_input w-100'
                      //min={new Date().toISOString().split('T')[0]}
                      {...register('dob4', {
                        // required: {
                        //   value: true,
                        //   message: 'Please enter date of birth.'
                        // }
                      })}
                    />
                    {/* <ErrorMessage message={errors?.dob4?.message} /> */}
                  </div>
                </div>

                <div className='form_group d-flex align-items-center w-50 pe-3'>
                  <label className='me-2'>
                    Address (Street, City, State, Zip):{' '}
                  </label>
                  <div className='position-relative flex-grow-1 pe-3'>
                    <input
                      type='text'
                      className='form_input w-100'
                      disabled={formView}
                      maxLength={15}
                      onInput={e => preventMaxInput(e, 15)}
                      {...register('street', {
                        // required: {
                        //   value: true,
                        //   message: 'Please enter address.'
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
                    <ErrorMessage message={errors?.street?.message} />
                  </div>
                </div>
              </div>

              <div className='form_group d-flex align-items-center w-50 pe-3'>
                <label className='me-2'>Percentage: </label>
                <div className='position-relative  pe-3'>
                  <input
                    type='text'
                    className='form_input w-100'
                    disabled={formView}
                    onInput={e => preventMaxHundred(e)}
                    onKeyDown={event => handleKeyDown(event)}
                    {...register('percent1', {
                      // required: {
                      //   value: true,
                      //   message: 'Please enter percent.'
                      // },
                      pattern: {
                        value: /^\d+$/,
                        message: 'Only Digits Are Allowed.'
                      },
                      maxLength: {
                        value: 100,
                        message: 'Max limit is 100.'
                      },
                      min: {
                        value: 1,
                        message: 'Minimum value must is 1.'
                      }
                    })}
                  />
                  <ErrorMessage message={errors?.percent1?.message} />
                </div>
              </div>

              <div className='text_wrap_row'>
                <div className='d-flex'>
                  <div className='form_group d-flex align-items-center w-50 pe-3'>
                    <label className='me-2'>
                      Full name (Last, First, Middle Initial):
                    </label>
                    <div className='position-relative flex-grow-1 pe-3'>
                      <input
                        type='text'
                        className='form_input w-100'
                        disabled={formView}
                        maxLength={15}
                        onInput={e => preventMaxInput(e, 15)}
                        {...register('fullNames', {
                          // required: {
                          //   value: true,
                          //   message: 'Please enter full name.'
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
                      <ErrorMessage message={errors?.fullNames?.message} />
                    </div>
                  </div>

                  <div className='form_group d-flex align-items-center w-50 pe-3'>
                    <label className='me-2'>Relationship:</label>
                    <div className='position-relative flex-grow-1 pe-3'>
                      <input
                        type='text'
                        className='form_input w-100'
                        maxLength={15}
                        disabled={formView}
                        onInput={e => preventMaxInput(e, 15)}
                        {...register('relationships', {
                          // required: {
                          //   value: true,
                          //   message: 'Please enter relationship.'
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
                      <ErrorMessage message={errors?.relationships?.message} />
                    </div>
                  </div>
                </div>
                <div className='d-flex'>
                  <div className='form_group d-flex align-items-center w-50 pe-3'>
                    <label className='me-2'>Date of birth: </label>
                    <div className='position-relative flex-grow-1 pe-3'>
                      <input
                        type='date'
                        disabled={formView}
                        className='form_input w-100'
                        //min={new Date().toISOString().split('T')[0]}
                        {...register('dob4', {
                          // required: {
                          //   value: true,
                          //   message: 'Please enter date of birth.'
                          // }
                        })}
                      />
                      {/* <ErrorMessage message={errors?.dob4?.message} /> */}
                    </div>
                  </div>

                  <div className='form_group d-flex align-items-center w-50 pe-3'>
                    <label className='me-2'>
                      Address (Street, City, State, Zip):{' '}
                    </label>
                    <div className='position-relative flex-grow-1 pe-3'>
                      <input
                        type='text'
                        className='form_input w-100'
                        disabled={formView}
                        maxLength={15}
                        onInput={e => preventMaxInput(e, 15)}
                        {...register('cities', {
                          // required: {
                          //   value: true,
                          //   message: 'Please enter city.'
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
                      <ErrorMessage message={errors?.cities?.message} />
                    </div>
                  </div>
                </div>

                <div className='form_group d-flex align-items-center w-50 pe-3'>
                  <label className='me-2'>Percentage: </label>
                  <div className='position-relative  pe-3'>
                    <input
                      type='text'
                      className='form_input w-100'
                      disabled={formView}
                      onInput={e => preventMaxHundred(e)}
                      onKeyDown={event => handleKeyDown(event)}
                      {...register('percentage', {
                        // required: {
                        //   value: true,
                        //   message: 'Please enter percentage.'
                        // },
                        pattern: {
                          value: /^\d+$/,
                          message: 'Only Digits Are Allowed.'
                        },
                        maxLength: {
                          value: 100,
                          message: 'Max limit is 100.'
                        },
                        min: {
                          value: 1,
                          message: 'Minimum value must is 1.'
                        }
                      })}
                    />
                    <ErrorMessage message={errors?.percentage?.message} />
                  </div>
                </div>
              </div>

              <div className='text_wrap_row'>
                <div className='d-flex'>
                  <div className='form_group d-flex align-items-center w-50 pe-3'>
                    <label className='me-2'>
                      Full name (Last, First, Middle Initial):
                    </label>
                    <div className='position-relative flex-grow-1 pe-3'>
                      <input
                        type='text'
                        className='form_input w-100'
                        disabled={formView}
                        maxLength={15}
                        onInput={e => preventMaxInput(e, 15)}
                        {...register('fullName', {
                          // required: {
                          //   value: true,
                          //   message: 'Please enter full name.'
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
                      <ErrorMessage message={errors?.fullName?.message} />
                    </div>
                  </div>

                  <div className='form_group d-flex align-items-center w-50 pe-3'>
                    <label className='me-2'>Relationship:</label>
                    <div className='position-relative flex-grow-1 pe-3'>
                      <input
                        type='text'
                        className='form_input w-100'
                        maxLength={15}
                        disabled={formView}
                        onInput={e => preventMaxInput(e, 15)}
                        {...register('relationship', {
                          // required: {
                          //   value: true,
                          //   message: 'Please enter relationship.'
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
                      <ErrorMessage message={errors?.relationship?.message} />
                    </div>
                  </div>
                </div>

                <div className='d-flex'>
                  <div className='form_group d-flex align-items-center w-50 pe-3'>
                    <label className='me-2'>Date of birth: </label>
                    <div className='position-relative flex-grow-1 pe-3'>
                      <input
                        type='date'
                        disabled={formView}
                        className='form_input w-100'
                        //min={new Date().toISOString().split('T')[0]}
                        {...register('dob5', {
                          // required: {
                          //   value: true,
                          //   message: 'Please enter date of birth.'
                          // }
                        })}
                      />
                      {/* <ErrorMessage message={errors?.dob5?.message} /> */}
                    </div>
                  </div>

                  <div className='form_group d-flex align-items-center w-50 pe-3'>
                    <label className='me-2'>
                      Address (Street, City, State, Zip):{' '}
                    </label>
                    <div className='position-relative flex-grow-1 pe-3'>
                      <input
                        type='text'
                        className='form_input w-100'
                        maxLength={15}
                        disabled={formView}
                        onInput={e => preventMaxInput(e, 15)}
                        {...register('address1', {
                          // required: {
                          //   value: true,
                          //   message: 'Please enter address.'
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
                      <ErrorMessage message={errors?.address1?.message} />
                    </div>
                  </div>
                </div>

                <div className='d-flex'>
                  <div className='form_group d-flex align-items-center w-50 pe-3'>
                    <label className='me-2'>Percentage: </label>
                    <div className='position-relative   pe-3'>
                      <input
                        type='text'
                        className='form_input '
                        disabled={formView}
                        onInput={e => preventMaxHundred(e)}
                        onKeyDown={event => handleKeyDown(event)}
                        {...register('percent', {
                          // required: {
                          //   value: true,
                          //   message: 'Please enter percent.'
                          // },
                          pattern: {
                            value: /^\d+$/,
                            message: 'Only Digits Are Allowed.'
                          },
                          maxLength: {
                            value: 100,
                            message: 'Max limit is 100.'
                          },
                          min: {
                            value: 1,
                            message: 'Minimum value must is 1.'
                          }
                        })}
                      />
                      <ErrorMessage message={errors?.percent?.message} />
                    </div>
                  </div>
                </div>
              </div>

              <div className='text_wrap_row'>
                <strong className='text-dark d-block'>
                  GUIDELINES FOR DESIGNATION OF BENEFICIARIES{' '}
                </strong>
                <b>General</b> Please be sure to include the beneficiary’s full
                name, social security number and relationship to you. Providing
                this information can help expedite the claim process by making
                it easier to locate and verify beneficiaries.
              </div>

              <div className='text_wrap_row'>
                <b>Minors </b>While you may designate minors as beneficiaries,
                please note that claim payments may be delayed due to special
                issues raised by these designations. In the event of a claim,
                the insurance proceeds may be paid to a duly appointed guardian
                of the child’s estate. You may wish to consult with an attorney
                when drafting your beneficiary designation.
              </div>

              <div className='text_wrap_row'>
                <b>Trust as Beneficiary </b>You may designate a trust as
                beneficiary, using the following form: To{' '}
                <div className='position-relative flex-grow-1 pe-3'>
                  <input
                    type='text'
                    className='form_input w-100'
                    maxLength={15}
                    disabled={formView}
                    placeholder='name of trustee'
                    onInput={e => preventMaxInput(e, 15)}
                    {...register('trusteeName', {
                      // required: {
                      //   value: true,
                      //   message: 'Please enter name of trustee.'
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
                  <ErrorMessage message={errors?.trusteeName?.message} />
                </div>
                , trustee of the{' '}
                <div className='position-relative flex-grow-1 pe-3'>
                  <input
                    type='text'
                    className='form_input w-100'
                    disabled={formView}
                    placeholder='name of trust'
                    maxLength={15}
                    onInput={e => preventMaxInput(e, 15)}
                    {...register('trustName', {
                      // required: {
                      //   value: true,
                      //   message: 'Please enter name of trust.'
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
                  <ErrorMessage message={errors?.trustName?.message} />
                </div>
                , under a trust agreement dated [date of trust]. If you wish to
                designate a testamentary trust as beneficiary (i.e., one created
                by will), please contact the Administrator for the appropriate
                form(s). You should recognize the possibility that your will,
                which was intended to create this trust, may not be admitted to
                probate (because it is lost, contested, or superseded by a later
                will). Claim payment delays can result if the beneficiary
                designation doesn’t provide for this situation. A special form
                is therefore needed to address these possibilities.
              </div>

              <div className='text_wrap_row'>
                <b>Life Status Changes </b>It is recommended that you review
                your beneficiary designation when various life status events
                occur, such as marriage, divorce, or birth of a child.
              </div>

              <div className='text_wrap_row'>
                <em>
                  Please note: The above guidelines are general and are not
                  intended to be relied on as legal advice. Unless your
                  designation is a simple one, we recommend that you obtain the
                  assistance of an attorney in drafting your beneficiary
                  designation. Qualified legal counsel can help assure that your
                  beneficiary designation clearly and correctly reflects your
                  intentions for distribution of your benefits.{' '}
                </em>
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
                onClick={handleSubmit(onSubmit, () => {
                  const isValidD = validateFunc()
                  if (!isValidD) return
                })}
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

export default BeneficiaryDesignationForm
