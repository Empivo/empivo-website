import React, { useState, useEffect, useContext } from 'react'
import { useForm } from 'react-hook-form'
import ErrorMessage from '@/pages/components/ErrorMessage'
import { preventMaxInput } from '@/utils/constants'
import { Form } from 'react-bootstrap'
import AuthContext from '@/context/AuthContext'
import apiPath from '@/utils/pathObj'
import { apiPost, apiPut } from '@/utils/apiFetch'
import useToastContext from '@/hooks/useToastContext'
import { useRouter } from 'next/router'
import RedStar from '@/pages/components/common/RedStar'

const EmployeeSatisfactionForm = ({
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

  const [radioButton, setRadioButton] = useState([
    {
      label:
        'How satisfied are you with the overall management of the company?',
      type: 'companyComment',
      radioBox: [
        'Very satisfied',
        'Mostly satisfied',
        'Mostly unsatisfied',
        'Very unsatisfied'
      ],
      value: undefined
    },
    {
      label:
        'Are you provided with the tools and materials necessary to complete your job duties?',
      type: 'dutiesComment',
      radioBox: ['Yes', 'Sometimes', 'No'],
      value: undefined
    },
    {
      label:
        'Do you receive enough support from your supervisor or job site supervisor?',
      type: 'supervisorComment',
      radioBox: ['Yes', 'Sometimes', 'No'],
      value: undefined
    },
    {
      label:
        'Do you believe that employees of the company are treated equally, and that the management team does not demonstrate favoritism?',
      type: 'demonstrateComment',
      radioBox: ['Yes', 'Sometimes', 'No'],
      value: undefined
    },
    {
      label:
        'Do the job duties that you complete on a regular basis (not including special events or during emergencies) match the job description that you were provided with when you were hired?',
      type: 'hiredComment',
      radioBox: ['Yes', 'Sometimes', 'No'],
      value: undefined
    },
    {
      label: 'Are you valued as a person by management?',
      type: 'managementComment',
      radioBox: ['Yes', 'Sometimes', 'No'],
      value: undefined
    },
    {
      label: 'Does management encourage teamwork?',
      type: 'teamworkComment',
      radioBox: ['Yes', 'Sometimes', 'No'],
      value: undefined
    },
    {
      label:
        'Are meetings held appropriately (when needed, in a timely and organized manner, etc)?',
      type: 'appropriatelyComment',
      radioBox: ['Yes', 'Sometimes', 'No'],
      value: undefined
    },
    {
      label:
        'Is management willing to make changes and improvements to the company when necessary?',
      type: 'improvementsComment',
      radioBox: ['Yes', 'Sometimes', 'No'],
      value: undefined
    },
    {
      label: 'Overall, are you satisfied with your job assignment?',
      type: 'assignmentComment',
      radioBox: ['Yes', 'Sometimes', 'No'],
      value: undefined
    }
  ])

  const handleRadioChange = (index, data) => {
    let radioButtons = [...radioButton]
    radioButtons[index].value = data
    setRadioButton(radioButtons)
  }

  const onSubmit = async data => {
    try {
      data.rating = radioButton?.map(item => {
        return { label: item?.label, value: item?.value }
      })
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

  const setRadioBut = data => {
    const radioBut = [...radioButton]
    radioButton?.map((item, index) => {
      item.label = data ? data[index]?.label : ''
      item.value = data ? data[index]?.value : ''
    })
    setRadioButton(radioBut)
  }

  useEffect(() => {
    if (Object.keys(currentFormItem?.data || {})?.length) {
      setRadioBut(currentFormItem?.data?.rating)

      reset(currentFormItem.data)
    }
  }, [currentFormItem.data])

  return (
    <div className='employee_application_form py-3'>
      <div className='similar_wrapper text-dark'>
        <div className='employee_application_form_wrap'>
          <div className='text_wrap_row text-center text-dark bg-light mb-4'>
            <strong className='text-lg'>
              EMPLOYEE SATISFACTION SURVEY FORM
            </strong>
          </div>
          <p>
            Please note participation is voluntary. The answers to this survey
            are anonymous and confidential. If you choose to complete the
            survey, we plan to use the results to improve job satisfaction and
            any problems deemed necessary. When formulating your responses,
            please answer honestly and thoroughly. Thank you!
          </p>
          <p>
            Sincerely, <br />
            The Senior Management Team
          </p>

          <ol>
            {radioButton?.map((item, index) => (
              <>
                <li className='mb-4'>
                  <p>{item.label}</p>
                  {item?.radioBox?.map((item2, index2) => (
                    <>
                      <Form.Check
                        type='radio'
                        checked={item2 === item?.value}
                        disabled={formView}
                        label={item2}
                        id={`check${index + 1}`}
                        name={`check${index + 1}`}
                        className='radio_btn mb-3'
                        onChange={e => handleRadioChange(index, item2)}
                      />
                    </>
                  ))}
                  <label htmlFor=''>Comments:</label>
                  <textarea
                    name=''
                    id=''
                    cols='30'
                    rows='3'
                    className='form-control'
                    disabled={formView}
                    maxLength={50}
                    onInput={e => preventMaxInput(e, 50)}
                    {...register(item.type, {
                      // required: {
                      //   value: true,
                      //   message: 'Please enter comments.'
                      // },
                      minLength: {
                        value: 2,
                        message: 'Minimum length must be 2.'
                      },
                      maxLength: {
                        value: 50,
                        message: 'Maximum length must be 50.'
                      }
                    })}
                  ></textarea>
                  <ErrorMessage message={errors[item.type]?.message} />
                </li>
              </>
            ))}
          </ol>

          <label htmlFor=''>
            Additional comments and suggestions: <RedStar />
          </label>
          <textarea
            name=''
            id=''
            cols='30'
            rows='8'
            className='form-control'
            disabled={formView}
            maxLength={50}
            onInput={e => preventMaxInput(e, 50)}
            {...register('additionalComment', {
              required: {
                value: true,
                message: 'Please enter additional comments.'
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
          ></textarea>
          <ErrorMessage message={errors?.additionalComment?.message} />
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

export default EmployeeSatisfactionForm
