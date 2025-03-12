import React, { useState, useEffect, useContext } from 'react'
import { useForm } from 'react-hook-form'
import ErrorMessage from '@/pages/components/ErrorMessage'
import { preventMaxInput } from '@/utils/constants'
import AuthContext from '@/context/AuthContext'
import apiPath from '@/utils/pathObj'
import { apiPost, apiPut } from '@/utils/apiFetch'
import useToastContext from '@/hooks/useToastContext'
import { startCase } from 'lodash'
import { useRouter } from 'next/router'
import RedStar from '@/pages/components/common/RedStar'

const CandidateInterviewForm = ({
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
      label: 'Educational Background',
      type: 'comment',
      description:
        'Does the candidate have the appropriate educational qualifications or training for this position?',
      value: undefined
    },
    {
      label: 'Prior Work Experience',
      type: 'experienceComment',
      description:
        'Has the candidate acquired necessary skills or qualifications through past work experiences?',
      value: undefined
    },
    {
      label: 'Technical Qualifications/Experience',
      type: 'technicalComment',
      description:
        'Does the candidate have the technical skills necessary for this position?',
      value: undefined
    },
    {
      label: 'Leadership Ability',
      type: 'abilityComment',
      description:
        'Did the candidate demonstrate the leadership skills necessary for this position?',
      value: undefined
    },
    {
      label: 'Customer Service Skills',
      type: 'skillsComment',
      description:
        'Did the candidate demonstrate the knowledge and skills to create a positive customer experience/interaction necessary for this position?',
      value: undefined
    },
    {
      label: 'Communication Skills',
      type: 'communicationComment',
      description:
        'How were the candidate’s communication skills during the interview?',
      value: undefined
    },
    {
      label: 'Candidate Enthusiasm',
      type: 'enthusiasmComment',
      description: 'How much interest did the candidate show in the position?',
      value: undefined
    },
    {
      label: 'Candidates',
      type: 'positionComment',
      description:
        'Does the candidate demonstrate the knowledge of these areas necessary for this position?',
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
      data.rating = radioButton
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
      setRadioButton(currentFormItem?.data?.rating)

      reset(currentFormItem.data)
    }
  }, [currentFormItem.data])

  return (
    <div>
      <div className='employee_application_form py-3'>
        <div className='similar_wrapper'>
          <div className='employee_application_form_wrap'>
            <div className='text_wrap_row text-center text-dark bg-light'>
              <strong className='text-lg'>
                CANDIDATE INTERVIEW EVALUATION FORM
              </strong>
            </div>

            <div className='text_wrap_row'>
              <div className='py-3'>
                <div className='d-flex align-content-center justify-content-between'>
                  <div className='form_group d-flex align-items-center w-50 pe-3'>
                    <label className='me-2'>
                      Candidate’s Name <RedStar />
                    </label>
                    <div className='position-relative'>
                      <input
                        type='text'
                        disabled={formView}
                        className='form_input flex-grow-1'
                        maxLength={15}
                        onInput={e => preventMaxInput(e, 15)}
                        {...register('name', {
                          required: {
                            value: true,
                            message: 'Please enter candidate’s name.'
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
                      <ErrorMessage message={errors?.name?.message} />
                    </div>
                  </div>

                  <div className='form_group d-flex align-items-center w-50'>
                    <label className='me-2'>
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
                  </div>
                </div>

                <div className='d-flex align-content-center justify-content-between'>
                  <div className='form_group d-flex align-items-center w-50 pe-3'>
                    <label className='me-2'>
                      Position: <RedStar />
                    </label>
                    <div className='position-relative'>
                      <input
                        type='text'
                        disabled={formView}
                        className='form_input flex-grow-1'
                        maxLength={15}
                        onInput={e => preventMaxInput(e, 15)}
                        {...register('position', {
                          required: {
                            value: true,
                            message: 'Please enter position.'
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
                      <ErrorMessage message={errors?.position?.message} />
                    </div>
                  </div>

                  <div className='form_group d-flex align-items-center w-50'>
                    <label className='me-2'>
                      Interviewed By: <RedStar />
                    </label>
                    <div className='position-relative'>
                      <input
                        type='text'
                        disabled={formView}
                        className='form_input flex-grow-1'
                        maxLength={15}
                        onInput={e => preventMaxInput(e, 15)}
                        {...register('interviewedBy', {
                          required: {
                            value: true,
                            message: 'Please enter interviewed by.'
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
                      <ErrorMessage message={errors?.interviewedBy?.message} />
                    </div>
                  </div>
                </div>
              </div>

              <div className='py-3 scoring'>
                <strong className='text-dark d-block text-center'>
                  Scoring
                </strong>
                <p>
                  Candidate evaluation forms are to be completed by the
                  interviewer to rank the candidate’s overall qualifications for
                  the position. Under each heading the interviewer should give
                  the candidate a numerical rating and write specific job
                  related comments in the space provided. The numerical rating
                  system is based on the following:
                </p>

                <ul className='list-unstyled ps-3 mb-0'>
                  <li>
                    <strong>O – </strong>Outstanding – Applicant is exceptional;
                    recognized as being far superior to others.{' '}
                  </li>
                  <li>
                    <strong>V – </strong>Very Good – Applicant clearly exceeds
                    position requirements.
                  </li>
                  <li>
                    <strong>G – </strong>Good – Applicant is competent and
                    dependable. Meets standards of the job.
                  </li>
                  <li>
                    <strong>I – </strong>Improvement Needed – Applicant is
                    deficient or below standards required of the job.
                  </li>
                  <li>
                    <strong>U – </strong>Unsatisfactory – Applicant is generally
                    unacceptable.
                  </li>
                </ul>
              </div>

              <div className='py-3 scoring'>
                <div className='feedback_block'>
                  {radioButton?.map((item, index) => (
                    <>
                      <p>
                        <strong className='text-dark'>{item.label} –</strong>{' '}
                        {item.description}
                      </p>
                      <div className='rating d-flex align-items-center'>
                        <strong className='pe-2 text-dark'>Rating:</strong>
                        <div className='d-flex radio_list'>
                          {['O', 'V', 'G', 'I', 'U']?.map(data => (
                            <>
                              <label className='mx-1'>
                                {data}
                                <input
                                  type='radio'
                                  id={data}
                                  disabled={formView}
                                  // name='rating1'
                                  onChange={() =>
                                    handleRadioChange(index, data)
                                  }
                                  checked={data === item.value}
                                />
                                <small className='radio_f'></small>
                              </label>
                            </>
                          ))}
                        </div>
                      </div>
                      <div className='comments_box my-3'>
                        <textarea
                          placeholder={startCase(item.type)}
                          disabled={formView}
                          className='form_input w-100 p-2'
                          maxLength={50}
                          onInput={e => preventMaxInput(e, 50)}
                          {...register(item.type, {
                            // required: {
                            //   value: true,
                            //   message: radioButtonValidation[item.type]
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
                      </div>
                    </>
                  ))}
                </div>
                <div className='feedback_block'>
                  <p>
                    <strong className='text-dark'>Other Qualifications</strong>
                  </p>

                  <div className='form_group d-flex align-items-center pe-3'>
                    <label className='me-2'>(Specify):</label>
                    <div className='position-relative'>
                      <input
                        type='text'
                        disabled={formView}
                        className='form_input flex-grow-1'
                        maxLength={50}
                        onInput={e => preventMaxInput(e, 50)}
                        {...register('specify', {
                          // required: {
                          //   value: true,
                          //   message: 'Please enter specify.'
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
                      />
                      <ErrorMessage message={errors?.specify?.message} />
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
      </div>
    </div>
  )
}

export default CandidateInterviewForm
