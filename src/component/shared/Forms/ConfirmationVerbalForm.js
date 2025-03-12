import React, { useEffect, useContext } from 'react'
import { useForm } from 'react-hook-form'
import ErrorMessage from '@/pages/components/ErrorMessage'
import { preventMaxInput } from '@/utils/constants'
import AuthContext from '@/context/AuthContext'
import apiPath from '@/utils/pathObj'
import { apiPost, apiPut } from '@/utils/apiFetch'
import useToastContext from '@/hooks/useToastContext'
import { useRouter } from 'next/router'
import { Col, Row } from 'react-bootstrap'
import RedStar from '@/pages/components/common/RedStar'

const ConfirmationVerbalForm = ({
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
  const notification = useToastContext()
  const router = useRouter()
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

  return (
    <div className='employee_application_form py-3'>
      <div className='similar_wrapper text-dark'>
        <div className='employee_application_form_wrap'>
          <div className='text_wrap_row text-center text-dark bg-light mb-4'>
            <strong className='text-lg'>
              Confirmation of Verbal Resignation
            </strong>
          </div>

          <Row>
            <Col md={6}>
              <div className='d-flex align-items-center mb-3'>
                <label htmlFor='' className='m-0 text-dark'>
                  Date: <RedStar />
                </label>
                <div className='position-relative flex-grow-1'>
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
              </div>
            </Col>

            <Col md={6}>
              <div className='d-flex align-items-center mb-3'>
                <label htmlFor='' className='m-0 text-dark'>
                  To:
                </label>
                <div className='position-relative flex-grow-1'>
                  <input
                    type='text'
                    className='form_input w-100'
                    disabled={formView}
                    onInput={e => preventMaxInput(e, 15)}
                    {...register('to', {
                      // required: {
                      //   value: true,
                      //   message: 'Please enter to.'
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
                  <ErrorMessage message={errors?.to?.message} />
                </div>
              </div>
            </Col>
          </Row>
          <p>From: Human Resource Department </p>
          <p>Re: Confirmation of Your Resignation </p>
          <p>
            <div className='d-flex align-items-center'>
              We received notification from{' '}
              <div className='position-relative mx-3 flex-grow-1'>
                <input
                  type='text'
                  className='form_input w-100'
                  placeholder='name of supervisor/manager'
                  disabled={formView}
                  maxLength={15}
                  onInput={e => preventMaxInput(e, 15)}
                  {...register('supervisorName', {
                    // required: {
                    //   value: true,
                    //   message: 'Please enter name of supervisor/manager.'
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
                <ErrorMessage message={errors?.supervisorName?.message} />
              </div>
            </div>
            <div className='d-flex align-items-center'>
              that you verbally resigned your employment on{' '}
              <div className='position-relative mx-3'>
                <input
                  type='date'
                  disabled={formView}
                  placeholder='date'
                  className='form_input'
                  //min={new Date().toISOString().split('T')[0]}
                  {...register('employmentDate', {
                    // required: {
                    //   value: true,
                    //   message: 'Please enter date.'
                    // }
                  })}
                />
                {/* <ErrorMessage message={errors?.employmentDate?.message} /> */}
              </div>
              . You indicated you are resigning due to{' '}
            </div>
            <div className='d-flex align-items-center'>
              <div className='position-relative'>
                <input
                  type='text'
                  className='form_input'
                  placeholder='reason for resignation'
                  maxLength={15}
                  disabled={formView}
                  onInput={e => preventMaxInput(e, 15)}
                  {...register('resignationReason', {
                    // required: {
                    //   value: true,
                    //   message: 'Please enter reason for resignation.'
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
                <ErrorMessage message={errors?.resignationReason?.message} />
              </div>
              .{' '}
            </div>
          </p>
          <p>
            Consistent with company policy we are accepting your resignation
            with a final date of employment of{' '}
            <div className='d-flex align-items-center'>
              <div className='position-relative'>
                <input
                  type='date'
                  disabled={formView}
                  placeholder='date'
                  className='form_input'
                  min={new Date().toISOString().split('T')[0]}
                  {...register('finalEmploymentDate', {
                    // required: {
                    //   value: true,
                    //   message: 'Please enter date.'
                    // }
                  })}
                />
                {/* <ErrorMessage message={errors?.finalEmploymentDate?.message} /> */}
              </div>
              .{' '}
            </div>
          </p>
          <p>
            <i>
              [Optional: We do not need you to actually work your entire notice
              period but will provide compensation to you in the amount you
              would have received had you actively worked this time period. The
              last day you are actually needed to report to work is therefore
              today,{' '}
              <div className='position-relative'>
                <input
                  type='date'
                  disabled={formView}
                  className='form_input'
                  placeholder='today’s date'
                  min={new Date().toISOString().split('T')[0]}
                  {...register('todaysDate', {
                    // required: {
                    //   value: true,
                    //   message: 'Please enter date.'
                    // }
                  })}
                />
                {/* <ErrorMessage message={errors?.todaysDate?.message} /> */}
              </div>{' '}
            </i>
          </p>
          <p>
            Your final check will be provided consistent with state law
            requirements.{' '}
          </p>
          <p>
            Benefits will cease according to company policy and you will be
            notified separately to the extent required by law of any continuing
            rights you have under these policies. Your exit meeting has been
            scheduled for{' '}
            <div className='d-flex align-items-center'>
              <div className='position-relative my-3'>
                <input
                  type='date'
                  disabled={formView}
                  className='form_input'
                  placeholder='date/time/place'
                  min={new Date().toISOString().split('T')[0]}
                  {...register('scheduledDate', {
                    // required: {
                    //   value: true,
                    //   message: 'Please enter date.'
                    // }
                  })}
                />
                {/* <ErrorMessage message={errors?.scheduledDate?.message} /> */}
              </div>
              .
            </div>
            Your feedback regarding your experience working for us will be
            invaluable as we continue to try to make this a great place to work.
            As we will provide you with other important information at this
            session please let us know if you need to reschedule for any reason.{' '}
          </p>

          <p>
            Should you have any questions, please don’t hesitate to contact
            human resources.{' '}
          </p>
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
  )
}

export default ConfirmationVerbalForm
