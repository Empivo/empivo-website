import React, { useState, useEffect, useContext, useRef } from 'react'
import { useForm } from 'react-hook-form'
import ErrorMessage from '@/pages/components/ErrorMessage'
import { preventMaxInput } from '@/utils/constants'
import { Row, Col } from 'react-bootstrap'
import AuthContext from '@/context/AuthContext'
import apiPath from '@/utils/pathObj'
import { apiPost, apiPut } from '@/utils/apiFetch'
import useToastContext from '@/hooks/useToastContext'
import { useRouter } from 'next/router'
import SignPage from '@/pages/components/SignPage'
import RedStar from '@/pages/components/common/RedStar'

const DrugTestingReasonableForm = ({
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

  const [preview, setPreview] = useState({
    sign: null,
    secondObserverSign: null
  })
  const [src, setSrc] = useState(null)
  const [imageName, setImageName] = useState({
    sign: null,
    secondObserverSign: null
  })
  const [imageData, setImageData] = useState({
    sign: null,
    secondObserverSign: null
  })
  const [modalOpen, setModalOpen] = useState({
    sign: false,
    secondObserverSign: false
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

  const onSubmit = async data => {
    try {
      let payload = {
        jobID: acceptedJobs?.Job?._id,
        companyID: acceptedJobs?.companyID,
        formType: formCategoryType,
        content: {
          ...data,
          sign: JSON.stringify({
            sign: imageData.sign
          }),
          secondObserverSign: JSON.stringify({
            secondObserverSign: imageData.secondObserverSign
          })
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
      setFileImage(
        'sign',
        currentFormItem.data?.sign,
        'secondObserverSign',
        currentFormItem.data?.secondObserverSign
      )
      reset(currentFormItem.data)
      setValue('sign', '')
      setValue('secondObserverSign', '')
    }
  }, [currentFormItem.data])

  const handleObjectLength = obj => Object.keys(obj || {})?.length

  return (
    <div className='employee_application_form py-3'>
      <div className='similar_wrapper text-dark'>
        <div className='employee_application_form_wrap'>
          <div className='text_wrap_row text-center text-dark bg-light mb-4'>
            <strong className='text-lg'>
              Drug Testing: Reasonable Suspicion Documentation
            </strong>
          </div>

          <Row>
            <Col md={6}>
              <div className='d-flex align-items-center mb-3'>
                <label htmlFor='' className='m-0 text-dark'>
                  Date:
                </label>
                <div className='position-relative flex-grow-1'>
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
            </Col>
            <Col md={6}>
              <div className='d-flex align-items-center mb-3'>
                <label htmlFor='' className='m-0 text-dark'>
                  Employee name: <RedStar />
                </label>
                <div className='position-relative flex-grow-1'>
                  <input
                    type='text'
                    className='form_input w-100'
                    disabled={formView}
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
            </Col>
            <Col md={6}>
              <div className='d-flex align-items-center mb-3'>
                <label htmlFor='' className='m-0 text-dark'>
                  Job title: <RedStar />
                </label>
                <div className='position-relative flex-grow-1'>
                  <input
                    type='text'
                    className='form_input w-100'
                    disabled={formView}
                    maxLength={15}
                    onInput={e => preventMaxInput(e, 15)}
                    {...register('jobTitle', {
                      required: {
                        value: true,
                        message: 'Please enter job title.'
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
                  <ErrorMessage message={errors?.jobTitle?.message} />
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className='d-flex align-items-center mb-3'>
                <label htmlFor='' className='m-0 text-dark'>
                  Location/Department: <RedStar />
                </label>
                <div className='position-relative flex-grow-1'>
                  <input
                    type='text'
                    className='form_input w-100'
                    disabled={formView}
                    maxLength={15}
                    onInput={e => preventMaxInput(e, 15)}
                    {...register('department', {
                      required: {
                        value: true,
                        message: 'Please enter location/department.'
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
                  <ErrorMessage message={errors?.department?.message} />
                </div>
              </div>
            </Col>
          </Row>

          <p>
            Prior to sending any employee for drug or alcohol testing due to a
            reasonable suspicion, this form must be completed by two members of
            management who have had a first-hand observation or conversation
            with the employee. In rare situations, a second member of management
            may not be available to witness the behavior. If the employee is in
            a safety sensitive area, remove them from work immediately until a
            second observer can talk with the employee and/or a decision can be
            made on whether testing is necessary.{' '}
          </p>
          <p>
            When completing the following document, list all observations you
            noticed. Be as specific as possible including names of
            employees/witnesses, when and where you noticed these behaviors
            occurring, what the employee was doing at the time and any witnesses
            of these events. Include any observations or changes in appearance,
            smell, speech, movement or actions of the employee. Some signs of
            impairment may include slurred speech, difficulty walking,
            clumsiness, dilated pupils, watery and/or red eyes.{' '}
          </p>

          <Row className='g-4'>
            <Col md={6}>
              <label htmlFor='Name' className='m-0'>
                First observer’s name:
              </label>
              <input
                type='text'
                className='form_input w-100'
                disabled={formView}
                maxLength={15}
                onInput={e => preventMaxInput(e, 15)}
                {...register('observerName', {
                  // required: {
                  //   value: true,
                  //   message: 'Please enter first observer name.'
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
              <ErrorMessage message={errors?.observerName?.message} />
            </Col>
            <Col md={6}>
              <label htmlFor='Name' className='m-0'>
                Job title:
              </label>
              <input
                type='text'
                className='form_input w-100'
                disabled={formView}
                maxLength={15}
                onInput={e => preventMaxInput(e, 15)}
                {...register('observerTitle', {
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
              <ErrorMessage message={errors?.observerTitle?.message} />
            </Col>
            <Col md={12}>
              <label htmlFor='Name' className='m-0'>
                Observations:
              </label>
              <input
                type='text'
                className='form_input w-100'
                disabled={formView}
                maxLength={15}
                onInput={e => preventMaxInput(e, 15)}
                {...register('observations', {
                  // required: {
                  //   value: true,
                  //   message: 'Please enter observation.'
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
              <ErrorMessage message={errors?.observations?.message} />
            </Col>
            <Col md={6}>
              <label htmlFor='Name' className='m-0'>
                Signature: <RedStar />
              </label>
              <SignPage
                imageName={imageName.sign}
                register={register('sign', {
                  required: {
                    value: preview.sign ? false : true,
                    message: 'Please select signature'
                  }
                })}
                imageRef={imageRef1}
                formView={formView}
                handleImgChange={handleImgChange}
                modalOpen={modalOpen}
                handleSave={handleSave}
                src={src}
                text={'sign'}
                image={preview?.sign}
                errorCond={errors?.sign}
                imageShow={handleObjectLength(currentFormItem.data)}
                errors={<ErrorMessage message='Please select signature' />}
              />
            </Col>
            <Col md={6}>
              <label htmlFor='Name' className='m-0'>
                Date:
              </label>
              <input
                type='date'
                disabled={formView}
                className='form_input w-100'
                min={new Date().toISOString().split('T')[0]}
                {...register('observerDate', {
                  // required: {
                  //   value: true,
                  //   message: 'Please enter date.'
                  // }
                })}
              />
              {/* <ErrorMessage message={errors?.observerDate?.message} /> */}
            </Col>

            <Col md={6}>
              <label htmlFor='Name' className='m-0'>
                Second observer’s name:
              </label>
              <input
                type='text'
                className='form_input w-100'
                disabled={formView}
                maxLength={15}
                onInput={e => preventMaxInput(e, 15)}
                {...register('secondObserverName', {
                  // required: {
                  //   value: true,
                  //   message: 'Please enter second observers name.'
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
              <ErrorMessage message={errors?.secondObserverName?.message} />
            </Col>
            <Col md={6}>
              <label htmlFor='Name' className='m-0'>
                Job title:
              </label>
              <input
                type='text'
                className='form_input w-100'
                disabled={formView}
                maxLength={15}
                onInput={e => preventMaxInput(e, 15)}
                {...register('secondObserverTitle', {
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
              <ErrorMessage message={errors?.secondObserverTitle?.message} />
            </Col>
            <Col md={12}>
              <label htmlFor='Name' className='m-0'>
                Observations:
              </label>
              <input
                type='text'
                className='form_input w-100'
                disabled={formView}
                maxLength={15}
                onInput={e => preventMaxInput(e, 15)}
                {...register('secondObservation', {
                  // required: {
                  //   value: true,
                  //   message: 'Please enter observation.'
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
              <ErrorMessage message={errors?.secondObservation?.message} />
            </Col>
            <Col md={6}>
              <label htmlFor='Name' className='m-0'>
                Signature: <RedStar />
              </label>
              <SignPage
                imageName={imageName.secondObserverSign}
                register={register('secondObserverSign', {
                  required: {
                    value: preview.secondObserverSign ? false : true,
                    message: 'Please select signature'
                  }
                })}
                imageRef={imageRef2}
                formView={formView}
                handleImgChange={handleImgChange}
                modalOpen={modalOpen}
                handleSave={handleSave}
                src={src}
                text={'secondObserverSign'}
                image={preview?.secondObserverSign}
                errorCond={errors?.secondObserverSign}
                imageShow={handleObjectLength(currentFormItem.data)}
                errors={
                  <ErrorMessage message='Please select secondObserverSign.' />
                }
              />
            </Col>
            <Col md={6}>
              <label htmlFor='Name' className='m-0'>
                Date:
              </label>
              <input
                type='date'
                disabled={formView}
                className='form_input w-100'
                min={new Date().toISOString().split('T')[0]}
                {...register('secondObserverDate', {
                  // required: {
                  //   value: true,
                  //   message: 'Please enter date.'
                  // }
                })}
              />
              {/* <ErrorMessage message={errors?.secondObserverDate?.message} /> */}
            </Col>
            <Col>
              <p className='text-dark'>
                Once the observations are documented, management should
                immediately meet with HR, if available, and make a decision as
                soon as possible on whether or not to send the employee for
                reasonable suspicion testing to rule out the possibility that
                they may be under the influence of drugs or alcohol at work.
                This decision should be made and handled in accordance with
                [Company Name]’s drug and alcohol policy and procedure.{' '}
              </p>
            </Col>
            <Col md={12}>
              <label htmlFor='Name' className='mt-0'>
                Describe action taken:
              </label>
              <textarea
                name=''
                className='form-control'
                id=''
                cols='30'
                rows='3'
                disabled={formView}
                maxLength={100}
                onInput={e => preventMaxInput(e, 100)}
                {...register('described', {
                  // required: {
                  //   value: true,
                  //   message: 'Please enter describe action taken.'
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
              ></textarea>
              <ErrorMessage message={errors?.described?.message} />
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

export default DrugTestingReasonableForm
