import React, { useEffect, useContext } from 'react'
import { useForm } from 'react-hook-form'
import ErrorMessage from '@/pages/components/ErrorMessage'
import AuthContext from '@/context/AuthContext'
import apiPath from '@/utils/pathObj'
import { apiPost, apiPut } from '@/utils/apiFetch'
import useToastContext from '@/hooks/useToastContext'
import { useRouter } from 'next/router'
import { preventMaxInput } from '@/utils/constants'
import RedStar from '@/pages/components/common/RedStar'

const TotalCompensationStatement = ({
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
    formState: { errors }
  } = useForm()
  const router = useRouter()
  const notification = useToastContext()
  const { acceptedJobs, currentFormItem, setCurrentItem } =
    useContext(AuthContext)

  const onSubmit = async data => {
    try {
      let payload = {
        jobID: acceptedJobs?.Job?._id,
        companyID: acceptedJobs?.companyID,
        formType: formCategoryType,
        content: data
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
    if (Object.keys(currentFormItem?.data || {})?.length) {
      reset(currentFormItem.data)
    }
  }, [currentFormItem.data])

  const preventMaxHundred = e => {
    if (e.target.value > 100) {
      e.target.value = e.target.value.slice(0, 2)
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

  return (
    <div>
      <div className='employee_application_form py-3'>
        <div className='similar_wrapper'>
          <div className='employee_application_form_wrap'>
            <div className='text_wrap_row text-center text-dark bg-light p-3'>
              <strong className='text-dark text-lg d-block'>
                Total Compensation Statement
              </strong>
            </div>

            <div className='text_wrap_row'>
              <p>
                As an employee of {acceptedJobs?.Company?.name}, you receive
                regular pay for the services you provide. The other part of your
                total compensation is the value of the benefits that{' '}
                {acceptedJobs?.Company?.name} makes available to you and your
                family. The value of these benefits is your “hidden paycheck.”
                This personalized benefits statement describes your hidden
                paycheck and is intended to give you a summary of the benefits
                you personally receive and their value.
              </p>

              <p>
                If you find any inaccuracies or have questions concerning your
                benefits and this statement, please contact human resources.{' '}
              </p>

              <p>
                Please realize that this personalized benefits statement is not
                a legal document. All benefits are governed by the actual
                benefit plans, which have precedence over the information
                reported in this statement. {acceptedJobs?.Company?.name}{' '}
                reserves the right to change, suspend, or cancel its benefit
                policies or practices with or without notice.
              </p>

              <div className='d-flex'>
                {' '}
                <div className='form_group d-flex flex-wrap align-items-center w-100'>
                  <label className='me-2'>
                    Employee name: <RedStar />{' '}
                  </label>
                  <div className='position-relative mx-3'>
                    <input
                      type='text'
                      className='form_input flex-grow-1'
                      maxLength={15}
                      disabled={formView}
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
                <div className='form_group d-flex flex-wrap align-items-center w-100'>
                  <label className='me-2'>
                    Date of hire: <RedStar />
                  </label>
                  <div className='position-relative mx-3'>
                    <input
                      type='date'
                      disabled={formView}
                      className='form_input flex-grow-1'
                      min={new Date().toISOString().split('T')[0]}
                      {...register('hireDate', {
                        required: {
                          value: true,
                          message: 'Please enter date of hire.'
                        }
                      })}
                    />
                    <ErrorMessage message={errors?.hireDate?.message} />
                  </div>
                </div>{' '}
              </div>
              <div className='form_group d-flex flex-wrap align-items-center w-100'>
                <label className='me-2'>
                  Current salary/rate: <RedStar />
                </label>
                <div className='position-relative mx-3'>
                  <input
                    type='number'
                    className='form_input flex-grow-1'
                    disabled={formView}
                    onKeyDown={event => handleKeyDown(event)}
                    {...register('currentSalary', {
                      required: 'Please enter current salary/rate.',
                      pattern: {
                        value: /^(?:[1-9]\d*|0)$/,
                        message: 'First character can not be 0.'
                      }
                    })}
                  />
                  <ErrorMessage message={errors?.currentSalary?.message} />
                </div>
              </div>

              <div className='py-3 d-flex align-items-center flex-wrap'>
                <strong>Medical Benefits </strong>
                <p className=' d-flex align-items-center flex-wrap'>
                  You have elected{' '}
                  <div className='position-relative mx-3'>
                    <input
                      type='text'
                      className='form_input flex-grow-1'
                      placeholder='insert type/level'
                      maxLength={15}
                      disabled={formView}
                      onInput={e => preventMaxInput(e, 15)}
                      {...register('typeLevel', {
                        // required: {
                        //   value: true,
                        //   message: 'Please enter insert type/level.'
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
                    <ErrorMessage message={errors?.typeLevel?.message} />
                  </div>{' '}
                  coverage for{' '}
                  <div className='position-relative mx-3'>
                    <input
                      type='text'
                      className='form_input flex-grow-1'
                      placeholder='medical, dental, vision'
                      disabled={formView}
                      maxLength={15}
                      onInput={e => preventMaxInput(e, 15)}
                      {...register('medicalDental', {
                        // required: {
                        //   value: true,
                        //   message: 'Please enter medical, dental, vision.'
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
                    <ErrorMessage message={errors?.medicalDental?.message} />
                  </div>
                  . {acceptedJobs?.Company?.name} pays{' '}
                  <div className='position-relative mx-3'>
                    <input
                      type='number'
                      className='form_input flex-grow-1'
                      placeholder='percent'
                      disabled={formView}
                      onInput={e => preventMaxHundred(e)}
                      onKeyDown={event => handleKeyDown(event)}
                      {...register('medicalBenefitsPercent', {
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
                    <ErrorMessage
                      message={errors?.medicalBenefitsPercent?.message}
                    />
                  </div>
                  of the cost of coverage for a total of{' '}
                  <div className='position-relative mx-3'>
                    <input
                      type='number'
                      className='form_input flex-grow-1'
                      placeholder='amount'
                      disabled={formView}
                      onKeyDown={event => handleKeyDown(event)}
                      {...register('medicalBenefitsAmount', {
                        // required: 'Please enter amount.',
                        pattern: {
                          value: /^(?:[1-9]\d*|0)$/,
                          message: 'First character can not be 0.'
                        }
                      })}
                    />
                    <ErrorMessage
                      message={errors?.medicalBenefitsAmount?.message}
                    />
                  </div>{' '}
                  per month.
                </p>
              </div>

              <div className='py-3'>
                <strong>Medical Savings Accounts </strong>
                <p className='d-flex align-items-center flex-wrap'>
                  Because you are enrolled in {acceptedJobs?.Company?.name};
                  high-deductible health plan, {acceptedJobs?.Company?.name}{' '}
                  contributes{' '}
                  <div className='position-relative mx-3'>
                    <input
                      type='number'
                      className='form_input flex-grow-1'
                      placeholder='percent'
                      disabled={formView}
                      onInput={e => preventMaxHundred(e)}
                      onKeyDown={event => handleKeyDown(event)}
                      {...register('medicalTotalPercent', {
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
                    <ErrorMessage
                      message={errors?.medicalTotalPercent?.message}
                    />
                  </div>{' '}
                  to a health savings account (HSA) in your name for a total of{' '}
                  <div className='position-relative mx-3'>
                    <input
                      type='number'
                      className='form_input flex-grow-1'
                      placeholder='amount'
                      disabled={formView}
                      onKeyDown={event => handleKeyDown(event)}
                      {...register('medicalTotalAmount', {
                        // required: 'Please enter amount.',
                        pattern: {
                          value: /^(?:[1-9]\d*|0)$/,
                          message: 'First character can not be 0.'
                        }
                      })}
                    />
                    <ErrorMessage
                      message={errors?.medicalTotalAmount?.message}
                    />
                  </div>{' '}
                  per month.
                </p>
              </div>

              <div className='py-3'>
                <strong>Medical Savings Accounts </strong>
                <p className='d-flex align-items-center flex-wrap'>
                  Because you are enrolled in {acceptedJobs?.Company?.name}{' '}
                  high-deductible health plan, {acceptedJobs?.Company?.name}{' '}
                  contributes{' '}
                  <div className='position-relative mx-3'>
                    <input
                      type='number'
                      className='form_input flex-grow-1'
                      placeholder='percent'
                      disabled={formView}
                      onInput={e => preventMaxHundred(e)}
                      onKeyDown={event => handleKeyDown(event)}
                      {...register('medicalPercent', {
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
                    <ErrorMessage message={errors?.medicalPercent?.message} />
                  </div>{' '}
                  to a health savings account (HSA) in your name for a total of{' '}
                  <div className='position-relative mx-3'>
                    <input
                      type='number'
                      className='form_input flex-grow-1'
                      placeholder='amount'
                      disabled={formView}
                      onKeyDown={event => handleKeyDown(event)}
                      {...register('savingAmountPerMonth', {
                        // required: 'Please enter amount.',
                        pattern: {
                          value: /^(?:[1-9]\d*|0)$/,
                          message: 'First character can not be 0.'
                        }
                      })}
                    />
                    <ErrorMessage
                      message={errors?.savingAmountPerMonth?.message}
                    />
                  </div>{' '}
                  per month.
                </p>
                <p className='d-flex align-items-center flex-wrap'>
                  You have elected to contribute{' '}
                  <div className='position-relative mx-3'>
                    <input
                      type='number'
                      className='form_input flex-grow-1'
                      placeholder='amount'
                      disabled={formView}
                      onKeyDown={event => handleKeyDown(event)}
                      {...register('medicalAmountPerPeriod', {
                        // required: 'Please enter amount.',
                        pattern: {
                          value: /^(?:[1-9]\d*|0)$/,
                          message: 'First character can not be 0.'
                        }
                      })}
                    />
                    {/* <ErrorMessage
                      message={errors?.medicalAmountPerPeriod?.message}
                    /> */}
                  </div>{' '}
                  per pay period to your medical flexible spending account
                  (FSA), which allows you to pay for your eligible health care
                  expenses on a pre-tax basis.
                  {acceptedJobs?.Company?.name} contributes{' '}
                  <div className='position-relative mx-3'>
                    <input
                      type='number'
                      className='form_input flex-grow-1'
                      placeholder='percent'
                      disabled={formView}
                      onInput={e => preventMaxHundred(e)}
                      onKeyDown={event => handleKeyDown(event)}
                      {...register('savingsPercent', {
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
                    <ErrorMessage message={errors?.savingsPercent?.message} />
                  </div>{' '}
                  to the FSA for a total of{' '}
                  <div className='position-relative mx-3'>
                    <input
                      type='number'
                      disabled={formView}
                      className='form_input flex-grow-1'
                      placeholder='amount'
                      onKeyDown={event => handleKeyDown(event)}
                      {...register('medicalAmountPerMonth', {
                        // required: 'Please enter amount.',
                        pattern: {
                          value: /^(?:[1-9]\d*|0)$/,
                          message: 'First character can not be 0.'
                        }
                      })}
                    />
                    <ErrorMessage
                      message={errors?.medicalAmountPerMonth?.message}
                    />
                  </div>{' '}
                  per month.
                </p>
              </div>

              <div className='py-3'>
                <strong>Dependent Care Account</strong>
                <p className='d-flex align-items-center flex-wrap'>
                  You have elected to contribute{' '}
                  <div className='position-relative mx-3'>
                    <input
                      type='number'
                      className='form_input flex-grow-1'
                      placeholder='amount'
                      disabled={formView}
                      onKeyDown={event => handleKeyDown(event)}
                      {...register('dependentCareAmount', {
                        // required: 'Please enter amount.',
                        pattern: {
                          value: /^(?:[1-9]\d*|0)$/,
                          message: 'First character can not be 0.'
                        }
                      })}
                    />
                    <ErrorMessage
                      message={errors?.dependentCareAmount?.message}
                    />
                  </div>{' '}
                  per pay period to your dependent care account, which allows
                  you to pay for your eligible employment-related dependent care
                  expenses on a pre-tax basis.
                </p>
              </div>

              <div className='py-3'>
                <strong>Paid Leave </strong>
                <p>
                  For the calendar year beginning January 1, your leave benefits
                  include:
                </p>
              </div>
              <div className='d-flex flex-wrap'>
                <div className='form_group d-flex flex-wrap align-items-center '>
                  <label className='me-2'>Accrued vacation leave: </label>
                  <div className='position-relative mx-3'>
                    <input
                      type='number'
                      className='form_input flex-grow-1'
                      disabled={formView}
                      onKeyDown={event => handleKeyDown(event)}
                      {...register('vacationLeave', {
                        // required: 'Please enter accrued vacation leave.',
                        pattern: {
                          value: /^(?:[1-9]\d*|0)$/,
                          message: 'First character can not be 0.'
                        }
                      })}
                    />
                    <ErrorMessage message={errors?.vacationLeave?.message} />
                  </div>
                </div>
                <div className='form_group d-flex flex-wrap align-items-center '>
                  <label className='me-2'>Accrual rate per pay period:</label>
                  <div className='position-relative mx-3'>
                    <input
                      type='number'
                      className='form_input flex-grow-1'
                      disabled={formView}
                      onKeyDown={event => handleKeyDown(event)}
                      {...register('vacationPeriod', {
                        // required: 'Please enter accrual rate per pay period.',
                        pattern: {
                          value: /^(?:[1-9]\d*|0)$/,
                          message: 'First character can not be 0.'
                        }
                      })}
                    />
                    <ErrorMessage message={errors?.vacationPeriod?.message} />
                  </div>
                </div>{' '}
              </div>
              <div className='d-flex flex-wrap'>
                <div className='form_group d-flex flex-wrap align-items-center'>
                  <label className='me-2'>Accrued sick leave:</label>
                  <div className='position-relative mx-3'>
                    <input
                      type='number'
                      className='form_input flex-grow-1'
                      disabled={formView}
                      onKeyDown={event => handleKeyDown(event)}
                      {...register('sickLeave', {
                        // required: 'Please enter accrued sick leave.',
                        pattern: {
                          value: /^(?:[1-9]\d*|0)$/,
                          message: 'First character can not be 0.'
                        }
                      })}
                    />
                    <ErrorMessage message={errors?.sickLeave?.message} />
                  </div>
                </div>

                <div className='form_group d-flex flex-wrap align-items-center '>
                  <label className='me-2'>Accrual rate per pay period:</label>
                  <div className='position-relative mx-3'>
                    <input
                      type='number'
                      className='form_input flex-grow-1'
                      disabled={formView}
                      onKeyDown={event => handleKeyDown(event)}
                      {...register('sickPeriod', {
                        // required: 'Accrual rate per pay period.',
                        pattern: {
                          value: /^(?:[1-9]\d*|0)$/,
                          message: 'First character can not be 0.'
                        }
                      })}
                    />
                    <ErrorMessage message={errors?.sickPeriod?.message} />
                  </div>
                </div>

                <div className='form_group d-flex flex-wrap align-items-center '>
                  <label className='me-2'>Holiday leave: </label>
                  <div className='position-relative mx-3'>
                    <input
                      type='date'
                      disabled={formView}
                      className='form_input flex-grow-1'
                      min={new Date().toISOString().split('T')[0]}
                      {...register('holidayLeave', {
                        // required: {
                        //   value: true,
                        //   message: 'Please enter holiday leave.'
                        // }
                      })}
                    />
                    {/* <ErrorMessage message={errors?.holidayLeave?.message} /> */}
                  </div>
                </div>
              </div>
              <div className='form_group d-flex flex-wrap align-items-center '>
                <label className='me-2'>Personal days:</label>
                <div className='position-relative mx-3'>
                  <input
                    type='number'
                    className='form_input flex-grow-1'
                    disabled={formView}
                    onKeyDown={event => handleKeyDown(event)}
                    {...register('personalDays', {
                      // required: 'Please enter personal days.',
                      pattern: {
                        value: /^(?:[1-9]\d*|0)$/,
                        message: 'First character can not be 0.'
                      }
                    })}
                  />
                  <ErrorMessage message={errors?.personalDays?.message} />
                </div>
              </div>

              <p className='d-flex align-items-center'>
                The total value of your paid leave for this calendar year (based
                on your current salary/wages) is{' '}
                <div className='position-relative mx-3'>
                  <input
                    type='number'
                    className='form_input flex-grow-1'
                    placeholder='amount'
                    disabled={formView}
                    onKeyDown={event => handleKeyDown(event)}
                    {...register('salaryAmount', {
                      // required: 'Please enter amount.',
                      pattern: {
                        value: /^(?:[1-9]\d*|0)$/,
                        message: 'First character can not be 0.'
                      }
                    })}
                  />
                  <ErrorMessage message={errors?.salaryAmount?.message} />
                </div>
                .
              </p>

              <p className='d-flex align-items-center flex-wrap'>
                In addition,{' '}
                <div className='position-relative mx-3'>
                  <input
                    type='text'
                    className='form_input flex-grow-1'
                    placeholder='Company name'
                    disabled={formView}
                    maxLength={15}
                    onInput={e => preventMaxInput(e, 15)}
                    {...register('companyName', {
                      // required: {
                      //   value: true,
                      //   message: 'Please enter company name.'
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
                  <ErrorMessage message={errors?.companyName?.message} />
                </div>{' '}
                has provisions for bereavement leave, jury duty leave, military
                leave and family and medical leave.
              </p>

              <div className='py-3'>
                <strong>Disability Insurance </strong>
                <p className='d-flex align-items-center flex-wrap'>
                  If you become disabled because of sickness or accident and are
                  unable to work on a short-term basis, you are eligible to
                  receive{' '}
                  <div className='position-relative mx-3'>
                    <input
                      type='number'
                      className='form_input flex-grow-1'
                      placeholder='percent'
                      disabled={formView}
                      onInput={e => preventMaxHundred(e)}
                      onKeyDown={event => handleKeyDown(event)}
                      {...register('receivePercent', {
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
                    <ErrorMessage message={errors?.receivePercent?.message} />
                  </div>{' '}
                  of your regular weekly wage up to a maximum of{' '}
                  <div className='position-relative mx-3'>
                    <input
                      type='number'
                      className='form_input flex-grow-1'
                      placeholder='amount'
                      disabled={formView}
                      onKeyDown={event => handleKeyDown(event)}
                      {...register('maximumAmount', {
                        // required: 'Please enter amount.',
                        pattern: {
                          value: /^(?:[1-9]\d*|0)$/,
                          message: 'First character can not be 0.'
                        }
                      })}
                    />
                    <ErrorMessage message={errors?.maximumAmount?.message} />
                  </div>{' '}
                  per week.{' '}
                  <div className='position-relative mx-3'>
                    <input
                      type='text'
                      className='form_input flex-grow-1'
                      disabled={formView}
                      maxLength={15}
                      onInput={e => preventMaxInput(e, 15)}
                      {...register('companyNames', {
                        // required: {
                        //   value: true,
                        //   message: 'Please enter company name.'
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
                    <ErrorMessage message={errors?.companyNames?.message} />
                  </div>{' '}
                  pays{' '}
                  <div className='position-relative mx-3'>
                    <input
                      type='number'
                      className='form_input flex-grow-1'
                      placeholder='percent'
                      disabled={formView}
                      onInput={e => preventMaxHundred(e)}
                      onKeyDown={event => handleKeyDown(event)}
                      {...register('paysPercent', {
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
                    <ErrorMessage message={errors?.paysPercent?.message} />
                  </div>{' '}
                  of the short-term disability premium for a total of{' '}
                  <div className='position-relative mx-3'>
                    <input
                      type='number'
                      className='form_input flex-grow-1'
                      placeholder='amount'
                      disabled={formView}
                      onKeyDown={event => handleKeyDown(event)}
                      {...register('totalAmount', {
                        // required: 'Please enter amount.',
                        pattern: {
                          value: /^(?:[1-9]\d*|0)$/,
                          message: 'First character can not be 0.'
                        }
                      })}
                    />
                    <ErrorMessage message={errors?.totalAmount?.message} />
                  </div>
                  per month.
                </p>

                <p className='d-flex align-items-center flex-wrap'>
                  If you are unable to work for long periods of time because of
                  sickness or accident, you are eligible to receive{' '}
                  <div className='position-relative mx-3'>
                    <input
                      type='number'
                      className='form_input flex-grow-1'
                      placeholder='percent'
                      disabled={formView}
                      onInput={e => preventMaxHundred(e)}
                      onKeyDown={event => handleKeyDown(event)}
                      {...register('receivePercents', {
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
                    <ErrorMessage message={errors?.receivePercents?.message} />
                  </div>{' '}
                  of your regular weekly wage up to a maximum of{' '}
                  <div className='position-relative mx-3'>
                    <input
                      type='number'
                      className='form_input flex-grow-1'
                      placeholder='amount'
                      disabled={formView}
                      onKeyDown={event => handleKeyDown(event)}
                      {...register('perWeekAmount', {
                        // required: 'Please enter amount.',
                        pattern: {
                          value: /^(?:[1-9]\d*|0)$/,
                          message: 'First character can not be 0.'
                        }
                      })}
                    />
                    <ErrorMessage message={errors?.perWeekAmount?.message} />
                  </div>{' '}
                  per week.{' '}
                  <div className='position-relative mx-3'>
                    <input
                      type='text'
                      className='form_input flex-grow-1'
                      maxLength={15}
                      disabled={formView}
                      onInput={e => preventMaxInput(e, 15)}
                      {...register('companyNamePays', {
                        // required: {
                        //   value: true,
                        //   message: 'Please enter company name.'
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
                    <ErrorMessage message={errors?.companyNamePays?.message} />
                  </div>{' '}
                  pays{' '}
                  <div className='position-relative mx-3'>
                    <input
                      type='number'
                      className='form_input flex-grow-1'
                      disabled={formView}
                      placeholder='percent'
                      onInput={e => preventMaxHundred(e)}
                      onKeyDown={event => handleKeyDown(event)}
                      {...register('paysPercents', {
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
                    <ErrorMessage message={errors?.paysPercents?.message} />
                  </div>{' '}
                  of the long-term disability premium for a total of{' '}
                  <div className='position-relative mx-3'>
                    <input
                      type='number'
                      className='form_input flex-grow-1'
                      disabled={formView}
                      placeholder='amount'
                      onKeyDown={event => handleKeyDown(event)}
                      {...register('perMonthAmount', {
                        // required: 'Please enter amount.',
                        pattern: {
                          value: /^(?:[1-9]\d*|0)$/,
                          message: 'First character can not be 0.'
                        }
                      })}
                    />
                    <ErrorMessage message={errors?.perMonthAmount?.message} />
                  </div>{' '}
                  per month.
                </p>
              </div>

              <div className='py-3'>
                <strong>Life Insurance </strong>
                <p className='d-flex align-items-center flex-wrap'>
                  You have individual coverage for life insurance in the amount
                  of{' '}
                  <div className='position-relative mx-3'>
                    <input
                      type='number'
                      className='form_input flex-grow-1'
                      disabled={formView}
                      placeholder='amount'
                      onKeyDown={event => handleKeyDown(event)}
                      {...register('insuranceAmount', {
                        // required: 'Please enter amount.',
                        pattern: {
                          value: /^(?:[1-9]\d*|0)$/,
                          message: 'First character can not be 0.'
                        }
                      })}
                    />
                    <ErrorMessage message={errors?.insuranceAmount?.message} />
                  </div>{' '}
                  times your annual salary.{' '}
                  <div className='position-relative mx-3'>
                    <input
                      type='text'
                      className='form_input flex-grow-1'
                      disabled={formView}
                      maxLength={15}
                      onInput={e => preventMaxInput(e, 15)}
                      {...register('insuranceCompanyName', {
                        // required: {
                        //   value: true,
                        //   message: 'Please enter company name.'
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
                      message={errors?.insuranceCompanyName?.message}
                    />
                  </div>{' '}
                  pays{' '}
                  <div className='position-relative mx-3'>
                    <input
                      type='number'
                      className='form_input flex-grow-1'
                      placeholder='percent'
                      disabled={formView}
                      onInput={e => preventMaxHundred(e)}
                      onKeyDown={event => handleKeyDown(event)}
                      {...register('insurancePercent', {
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
                    <ErrorMessage message={errors?.insurancePercent?.message} />
                  </div>{' '}
                  of the premium cost for a total of{' '}
                  <div className='position-relative mx-3'>
                    <input
                      type='number'
                      className='form_input flex-grow-1'
                      placeholder='amount'
                      disabled={formView}
                      onKeyDown={event => handleKeyDown(event)}
                      {...register('insuranceAmountPerMonth', {
                        // required: 'Please enter amount.',
                        pattern: {
                          value: /^(?:[1-9]\d*|0)$/,
                          message: 'First character can not be 0.'
                        }
                      })}
                    />
                    <ErrorMessage
                      message={errors?.insuranceAmountPerMonth?.message}
                    />
                  </div>{' '}
                  per month.
                </p>
              </div>

              <div className='py-3'>
                <strong>Employee Assistance Plan </strong>
                <p className='d-flex align-items-center flex-wrap'>
                  You are eligible to participate in this confidential service,
                  which provides initial professional counseling, and referral
                  services for employees who need emotional, financial, legal,
                  and other types of counseling.{' '}
                  <div className='position-relative mx-3'>
                    <input
                      type='text'
                      className='form_input flex-grow-1'
                      maxLength={15}
                      disabled={formView}
                      onInput={e => preventMaxInput(e, 15)}
                      {...register('assistanceCompanyName', {
                        // required: {
                        //   value: true,
                        //   message: 'Please enter company name.'
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
                      message={errors?.assistanceCompanyName?.message}
                    />
                  </div>{' '}
                  pays{' '}
                  <div className='position-relative mx-3'>
                    <input
                      type='number'
                      className='form_input flex-grow-1'
                      placeholder='percent'
                      disabled={formView}
                      onInput={e => preventMaxHundred(e)}
                      onKeyDown={event => handleKeyDown(event)}
                      {...register('assistancePercent', {
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
                    <ErrorMessage
                      message={errors?.assistancePercent?.message}
                    />
                  </div>
                  of the cost for this benefit for a total{' '}
                  <div className='position-relative mx-3'>
                    <input
                      type='number'
                      className='form_input flex-grow-1'
                      disabled={formView}
                      placeholder='amount'
                      onKeyDown={event => handleKeyDown(event)}
                      {...register('assistanceAmount', {
                        // required: 'Please enter amount.',
                        pattern: {
                          value: /^(?:[1-9]\d*|0)$/,
                          message: 'First character can not be 0.'
                        }
                      })}
                    />
                    <ErrorMessage message={errors?.assistanceAmount?.message} />
                  </div>{' '}
                  per month.
                </p>
              </div>

              <div className='py-3'>
                <strong>Social Security </strong>
                <p className='d-flex align-items-center flex-wrap'>
                  {<span>Company / Organization</span>} contributes to and also
                  forwards employee withholding taxes under FICA (Federal
                  Insurance Contributions Act which includes Social Security and
                  Medicare benefits) on your behalf. These benefits provide each
                  working American with retirement income and also
                </p>
                <p>
                  provide income security to employees in the event of
                  disability, income security to surviving members of deceased
                  workers families, and hospital insurance for the aged and the
                  disabled. You may request a Personal Earnings and Benefit
                  Statement (PEBES) from the Social Security Administration to
                  verify your earnings records and receive an estimate of your
                  future Social Security benefits.
                </p>
              </div>

              <div className='py-3'>
                <strong>Retirement </strong>
                <p className='d-flex align-items-center flex-wrap'>
                  {acceptedJobs?.Company?.name} sponsors a [type] retirement
                  plan in which you participate. {acceptedJobs?.Company?.name}{' '}
                  made a matching contribution in the amount of{' '}
                  <div className='position-relative mx-3'>
                    <input
                      type='number'
                      className='form_input flex-grow-1'
                      placeholder='amount'
                      disabled={formView}
                      onKeyDown={event => handleKeyDown(event)}
                      {...register('retirementAmount1', {
                        // required: 'Please enter amount.',
                        pattern: {
                          value: /^(?:[1-9]\d*|0)$/,
                          message: 'First character can not be 0.'
                        }
                      })}
                    />
                    <ErrorMessage
                      message={errors?.retirementAmount1?.message}
                    />
                  </div>{' '}
                  for plan year{' '}
                  <div className='position-relative mx-3'>
                    <input
                      type='number'
                      className='form_input flex-grow-1'
                      placeholder='year'
                      disabled={formView}
                      onKeyDown={event => handleKeyDown(event)}
                      {...register('year1', {
                        // required: 'Please enter year.',
                        minLength: {
                          value: 4,
                          message: 'Minimum length must be 4.'
                        },
                        maxLength: {
                          value: 4,
                          message: 'Maximum length must be 4.'
                        }
                      })}
                    />
                    <ErrorMessage message={errors?.year1?.message} />
                  </div>
                  . {acceptedJobs?.Company?.name} also made a discretionary
                  year-end contribution in the amount of{' '}
                  <div className='position-relative mx-3'>
                    <input
                      type='number'
                      className='form_input flex-grow-1'
                      placeholder='amount'
                      disabled={formView}
                      onKeyDown={event => handleKeyDown(event)}
                      {...register('retirementAmount', {
                        // required: 'Please enter amount.',
                        pattern: {
                          value: /^(?:[1-9]\d*|0)$/,
                          message: 'First character can not be 0.'
                        }
                      })}
                    />
                    <ErrorMessage message={errors?.retirementAmount?.message} />
                  </div>
                  for plan year{' '}
                  <div className='d-flex flex-wrap align-items-center'>
                    <div className='position-relative me-3'>
                      <input
                        type='number'
                        className='form_input '
                        placeholder='year'
                        disabled={formView}
                        onKeyDown={event => handleKeyDown(event)}
                        {...register('year', {
                          // required: 'Please enter year.',
                          minLength: {
                            value: 4,
                            message: 'Minimum length must be 4.'
                          },
                          maxLength: {
                            value: 4,
                            message: 'Maximum length must be 4.'
                          }
                        })}
                      />
                      <ErrorMessage message={errors?.year?.message} />
                    </div>
                    .{' '}
                  </div>
                  You receive a quarterly statement of your retirement benefits
                  through this plan and may also access your personal account
                  information online through{' '}
                  <div className='position-relative mx-3'>
                    <input
                      type='text'
                      className='form_input flex-grow-1'
                      placeholder='address'
                      disabled={formView}
                      maxLength={15}
                      onInput={e => preventMaxInput(e, 15)}
                      {...register('retirementAddress', {
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
                    <ErrorMessage
                      message={errors?.retirementAddress?.message}
                    />
                  </div>
                  .
                </p>
              </div>

              <div className='py-3'>
                <strong>TOTAL COMPENSATION </strong>
                <p>
                  As you may have realized after reading the above, your total
                  compensation is significantly higher than your annual salary
                  or wages.
                </p>
              </div>

              <div className='py-3'>
                <strong className='text-lg'>TOTAL COMPENSATION </strong>
                <p>
                  As you may have realized after reading the above, your total
                  compensation is significantly higher than your annual salary
                  or wages.
                </p>
                <strong>
                  {acceptedJobs?.Company?.name} cost for providing these
                  benefits equals approximately{' '}
                  <div className='position-relative mx-3'>
                    <input
                      type='number'
                      className='form_input flex-grow-1'
                      placeholder='percent'
                      disabled={formView}
                      onInput={e => preventMaxHundred(e)}
                      onKeyDown={event => handleKeyDown(event)}
                      {...register('compensationPercent', {
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
                    <ErrorMessage
                      message={errors?.compensationPercent?.message}
                    />
                  </div>{' '}
                  of your salary/wages or{' '}
                  <div className='position-relative mx-3'>
                    <input
                      type='number'
                      className='form_input flex-grow-1'
                      disabled={formView}
                      placeholder='amount'
                      onKeyDown={event => handleKeyDown(event)}
                      {...register('compensationAmount', {
                        // required: 'Please enter amount.',
                        pattern: {
                          value: /^(?:[1-9]\d*|0)$/,
                          message: 'First character can not be 0.'
                        }
                      })}
                    />
                    <ErrorMessage
                      message={errors?.compensationAmount?.message}
                    />
                  </div>{' '}
                  per year.
                </strong>
                <p className='my-2'>
                  As your length of employment increases with{' '}
                  {acceptedJobs?.Company?.name}, additional years of service may
                  further enhance the value of benefits, particularly your
                  retirement benefits.{' '}
                </p>
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
      </div>
    </div>
  )
}

export default TotalCompensationStatement
