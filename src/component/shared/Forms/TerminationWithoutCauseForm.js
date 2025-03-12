import React, { useEffect, useContext } from 'react'
import { useForm } from 'react-hook-form'
import ErrorMessage from '@/pages/components/ErrorMessage'
import AuthContext from '@/context/AuthContext'
import apiPath from '@/utils/pathObj'
import { apiPost, apiPut } from '@/utils/apiFetch'
import { useRouter } from 'next/router'
import useToastContext from '@/hooks/useToastContext'
import { preventMaxInput } from '@/utils/constants'

const TerminationWithoutCauseForm = ({
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
                Termination Without Cause Example Letter
              </strong>
            </div>

            <div className='application_formatting text-dark py-3 '>
              <div className='py-2 d-flex align-items-center flex-wrap '>
                <div className='position-relative mx-3'>
                  <input
                    type='date'
                    placeholder='date'
                    disabled={formView}
                    className='form_input flex-grow-1'
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
              <div className='py-2 d-flex align-items-center flex-wrap '>
                Dear{' '}
                <div className='position-relative mx-3'>
                  <input
                    type='text'
                    placeholder='Employee name'
                    className='form_input flex-grow-1'
                    maxLength={15}
                    disabled={formView}
                    onInput={e => preventMaxInput(e, 15)}
                    {...register('employeeName', {
                      // required: {
                      //   value: true,
                      //   message: 'Please enter employee name.'
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
                  <ErrorMessage message={errors?.employeeName?.message} />
                </div>
                ,
              </div>

              <div className='py-3'>
                <p className='d-flex align-items-center flex-wrap '>
                  I regret to inform you that your employment with{' '}
                  <div className='position-relative mx-3'>
                    <input
                      type='text'
                      placeholder='Company name'
                      className='form_input flex-grow-1'
                      maxLength={15}
                      disabled={formView}
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
                  is terminated effective{' '}
                  <div className='position-relative mx-3'>
                    <input
                      type='date'
                      placeholder='date'
                      disabled={formView}
                      className='form_input flex-grow-1'
                      min={new Date().toISOString().split('T')[0]}
                      {...register('companyDate', {
                        // required: {
                        //   value: true,
                        //   message: 'Please enter date .'
                        // }
                      })}
                    />
                    {/* <ErrorMessage message={errors?.companyDate?.message} /> */}
                  </div>
                  .
                </p>

                <p className='d-flex align-items-center flex-wrap '>
                  Four weeks of severance pay is being offered in exchange for
                  signing the attached release of claims and returning the
                  signed release to human resources no later than{' '}
                  <div className='d-flex'>
                    <div className='position-relative me-3'>
                      <input
                        type='date'
                        placeholder='date'
                        disabled={formView}
                        className='form_input flex-grow-1'
                        min={new Date().toISOString().split('T')[0]}
                        {...register('humanDate', {
                          // required: {
                          //   value: true,
                          //   message: 'Please enter date .'
                          // }
                        })}
                      />
                      {/* <ErrorMessage message={errors?.humanDate?.message} /> */}
                    </div>
                    .
                  </div>
                  If you choose not to sign the attached release of claims,
                  please inform human resources in writing of this decision.
                </p>
                <p className='d-flex align-items-center flex-wrap '>
                  Your final paycheck for hours worked will be paid on the
                  regularly scheduled payday following your last day of work.
                </p>
                <p className='d-flex align-items-center flex-wrap '>
                  Your health insurance benefits will continue through{' '}
                  <div className='position-relative mx-3'>
                    <input
                      type='date'
                      placeholder='date'
                      disabled={formView}
                      className='form_input flex-grow-1'
                      min={new Date().toISOString().split('T')[0]}
                      {...register('insuranceDate', {
                        // required: {
                        //   value: true,
                        //   message: 'Please enter date .'
                        // }
                      })}
                    />
                    {/* <ErrorMessage message={errors?.insuranceDate?.message} /> */}
                  </div>
                  . Your rights to continue coverage under COBRA will be
                  provided to you by mail from our plan administrator.
                </p>
                <p className='d-flex align-items-center flex-wrap'>
                  You can contact{' '}
                  <div className='position-relative mx-3 flex-grow-1'>
                    <input
                      type='text'
                      placeholder='retirement plan administrator'
                      className='form_input w-100'
                      maxLength={15}
                      onInput={e => preventMaxInput(e, 15)}
                      disabled={formView}
                      {...register('retirementPlan', {
                        // required: {
                        //   value: true,
                        //   message: 'Please enter retirement plan administrator.'
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
                    <ErrorMessage message={errors?.retirementPlan?.message} />
                  </div>
                  at{' '}
                  <div className='position-relative mx-3'>
                    <input
                      type='number'
                      disabled={formView}
                      placeholder='phone number'
                      className='form_input flex-grow-1'
                      onKeyDown={event => handleKeyDown(event)}
                      {...register('phoneNumber', {
                        // required: 'Please enter phone number.',
                        minLength: {
                          value: 10,
                          message: 'Minimum length should be 10 digits.'
                        },
                        maxLength: {
                          value: 10,
                          message: 'Maximum length should be 10 digits.'
                        },
                        pattern: {
                          value: /^(?:[1-9]\d*|0)$/,
                          message: 'First character can not be 0.'
                        }
                      })}
                    />
                    <ErrorMessage message={errors?.phoneNumber?.message} />
                  </div>{' '}
                  regarding your retirement plan distribution options.
                </p>
                <p>
                  The following {acceptedJobs?.Company?.name} property must be
                  returned to human resources on your final day of employment:
                </p>

                <p>[Type of property (cellphone, laptop, keys, etc.)]</p>
                <p className='d-flex align-items-center flex-wrap '>
                  Please contact me at{' '}
                  <div className='position-relative mx-3'>
                    <input
                      type='number'
                      disabled={formView}
                      placeholder='phone'
                      className='form_input flex-grow-1'
                      onKeyDown={event => handleKeyDown(event)}
                      {...register('phone', {
                        // required: 'Please enter phone.',
                        minLength: {
                          value: 10,
                          message: 'Minimum length should be 10 digits.'
                        },
                        maxLength: {
                          value: 10,
                          message: 'Maximum length should be 10 digits.'
                        },
                        pattern: {
                          value: /^(?:[1-9]\d*|0)$/,
                          message: 'First character can not be 0.'
                        }
                      })}
                    />
                    <ErrorMessage message={errors?.phone?.message} />
                  </div>
                  or{' '}
                  <div className='position-relative mx-3'>
                    <input
                      type='text'
                      disabled={formView}
                      placeholder='e-mail'
                      className='form_input flex-grow-1'
                      onInput={e => preventMaxInput(e)}
                      {...register('email', {
                        // required: 'Please enter email address.',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address.'
                        }
                      })}
                    />
                    <ErrorMessage message={errors?.email?.message} />
                  </div>{' '}
                  should you have any questions. Sincerely,
                </p>
              </div>

              <div className='py-2 d-flex align-items-center flex-wrap '>
                <div className='position-relative mx-3'>
                  <input
                    type='text'
                    placeholder='Name'
                    className='form_input flex-grow-1'
                    maxLength={15}
                    disabled={formView}
                    onInput={e => preventMaxInput(e, 15)}
                    {...register('name', {
                      // required: {
                      //   value: true,
                      //   message: 'Please enter name.'
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
                  <ErrorMessage message={errors?.name?.message} />
                </div>
              </div>
              <div className='py-2 d-flex align-items-center flex-wrap '>
                <div className='position-relative mx-3'>
                  <input
                    type='text'
                    placeholder='Job title'
                    className='form_input flex-grow-1'
                    maxLength={15}
                    disabled={formView}
                    onInput={e => preventMaxInput(e, 15)}
                    {...register('jobTitle', {
                      // required: {
                      //   value: true,
                      //   message: 'Please enter job title.'
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
                  <ErrorMessage message={errors?.jobTitle?.message} />
                </div>
              </div>
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

export default TerminationWithoutCauseForm
