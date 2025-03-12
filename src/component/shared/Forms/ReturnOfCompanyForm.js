import React, { useEffect, useContext } from 'react'
import { useForm } from 'react-hook-form'
import ErrorMessage from '@/pages/components/ErrorMessage'
import AuthContext from '@/context/AuthContext'
import apiPath from '@/utils/pathObj'
import { apiPost, apiPut } from '@/utils/apiFetch'
import { useRouter } from 'next/router'
import useToastContext from '@/hooks/useToastContext'
import { preventMaxInput } from '@/utils/constants'

const ReturnOfCompanyForm = ({
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
                Return of Company Property
              </strong>
            </div>

            <div className='application_formatting text-dark py-3  '>
              <span>Letter 1:</span>
              <div className='py-2 d-flex flex-wrap align-items-center'>
                Dear{' '}
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
                ,
              </div>
              <div className='py-2 d-flex flex-wrap align-items-center'>
                According to{' '}
                <div className='position-relative mx-3'>
                  <input
                    type='text'
                    placeholder='Company Name'
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
                policy, employees are required to return all company equipment
                upon termination. As of the writing of this letter, there is no
                record of your returning{' '}
                <div className='position-relative mx-3'>
                  <input
                    type='text'
                    placeholder='describe missing items'
                    className='form_input flex-grow-1'
                    maxLength={15}
                    disabled={formView}
                    onInput={e => preventMaxInput(e, 15)}
                    {...register('missingItems', {
                      // required: {
                      //   value: true,
                      //   message: 'Please enter describe missing items.'
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
                  <ErrorMessage message={errors?.missingItems?.message} />
                </div>
                . Please contact{' '}
                <div className='position-relative mx-3'>
                  <input
                    type='text'
                    placeholder='Name'
                    className='form_input flex-grow-1'
                    maxLength={15}
                    disabled={formView}
                    onInput={e => preventMaxInput(e, 15)}
                    {...register('names', {
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
                  <ErrorMessage message={errors?.names?.message} />
                </div>{' '}
                at{' '}
                <div className='position-relative mx-3'>
                  <input
                    type='number'
                    placeholder='phone'
                    className='form_input flex-grow-1'
                    disabled={formView}
                    onKeyDown={event => handleKeyDown(event)}
                    {...register('mobile', {
                      // required: {
                      //   value: true,
                      //   message: 'Please enter phone number.'
                      // },
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
                  <ErrorMessage message={errors?.mobile?.message} />
                </div>{' '}
                as soon as possible to arrange for the return of all property
                belonging to{' '}
                <div className='position-relative mx-3'>
                  <input
                    type='text'
                    placeholder='Company Name'
                    className='form_input flex-grow-1'
                    maxLength={15}
                    disabled={formView}
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
                </div>
                .
              </div>
              <div className='pt-2'>Regards,</div>
            </div>

            <div className='application_formatting text-dark py-3'>
              <span>Letter 2:</span>
              <div className='py-2 d-flex flex-wrap align-items-center'>
                Dear{' '}
                <div className='position-relative mx-3'>
                  <input
                    type='text'
                    placeholder='Name'
                    className='form_input flex-grow-1'
                    maxLength={15}
                    disabled={formView}
                    onInput={e => preventMaxInput(e, 15)}
                    {...register('leaveName', {
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
                  <ErrorMessage message={errors?.leaveName?.message} />
                </div>
                ,
              </div>
              <div className='py-2 d-flex flex-wrap align-items-center'>
                On{' '}
                <div className='position-relative mx-3'>
                  <input
                    type='date'
                    disabled={formView}
                    placeholder='Date'
                    className='form_input flex-grow-1'
                    min={new Date().toISOString().split('T')[0]}
                    {...register('leaveDate', {
                      // required: {
                      //   value: true,
                      //   message: 'Please enter date.'
                      // }
                    })}
                  />
                  {/* <ErrorMessage message={errors?.leaveDate?.message} /> */}
                </div>
                , a letter was sent to you regarding the return of
                <div className='position-relative mx-3'>
                  <input
                    type='text'
                    placeholder='describe missing items'
                    className='form_input flex-grow-1'
                    maxLength={15}
                    disabled={formView}
                    onInput={e => preventMaxInput(e, 15)}
                    {...register('missingItems1', {
                      // required: {
                      //   value: true,
                      //   message: 'Please enter describe missing items.'
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
                  <ErrorMessage message={errors?.missingItems1?.message} />
                </div>
                . As of the writing of this letter, there is no record of your
                returning the items in question. Please be advised that{' '}
                <div className='position-relative'>
                  <input
                    type='text'
                    placeholder='Company Name'
                    className='form_input flex-grow-1'
                    maxLength={15}
                    disabled={formView}
                    onInput={e => preventMaxInput(e, 15)}
                    {...register('leaveCompanyName1', {
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
                  <ErrorMessage message={errors?.leaveCompanyName1?.message} />
                </div>{' '}
                considers refusal to return company property to be theft. If the
                above listed items are not returned by [Date],{' '}
                <div className='position-relative mx-3'>
                  <input
                    type='text'
                    placeholder='Company Name'
                    className='form_input flex-grow-1'
                    maxLength={15}
                    disabled={formView}
                    onInput={e => preventMaxInput(e, 15)}
                    {...register('leaveCompanyName', {
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
                  <ErrorMessage message={errors?.leaveCompanyName?.message} />
                </div>{' '}
                will contact local law enforcement. Please contact{' '}
                <div className='position-relative mx-3'>
                  <input
                    type='text'
                    placeholder='Name'
                    className='form_input flex-grow-1'
                    maxLength={15}
                    disabled={formView}
                    onInput={e => preventMaxInput(e, 15)}
                    {...register('leaveNames', {
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
                  <ErrorMessage message={errors?.leaveNames?.message} />
                </div>{' '}
                at{' '}
                <div className='position-relative mx-3'>
                  <input
                    type='number'
                    placeholder='phone'
                    className='form_input flex-grow-1'
                    disabled={formView}
                    onKeyDown={event => handleKeyDown(event)}
                    {...register('leaveMobile', {
                      // required: {
                      //   value: true,
                      //   message: 'Please enter phone number.'
                      // },
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
                  <ErrorMessage message={errors?.leaveMobile?.message} />
                </div>{' '}
                immediately to arrange for the return of all property belonging
                to{' '}
                <div className='position-relative mx-3'>
                  <input
                    type='text'
                    placeholder='Company Name'
                    className='form_input flex-grow-1'
                    maxLength={15}
                    disabled={formView}
                    onInput={e => preventMaxInput(e, 15)}
                    {...register('leaveCompanyNames', {
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
                  <ErrorMessage message={errors?.leaveCompanyNames?.message} />
                </div>
                .
              </div>
              <div className='pt-2'>Regards,</div>
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

export default ReturnOfCompanyForm
