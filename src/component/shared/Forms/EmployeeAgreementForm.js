import React, { useState, useEffect, useContext, useRef } from 'react'
import { useForm } from 'react-hook-form'
import ErrorMessage from '@/pages/components/ErrorMessage'
import { preventMaxInput } from '@/utils/constants'
import AuthContext from '@/context/AuthContext'
import { InputGroup, Form } from 'react-bootstrap'
import apiPath from '@/utils/pathObj'
import { apiPost, apiPut } from '@/utils/apiFetch'
import useToastContext from '@/hooks/useToastContext'
import { useRouter } from 'next/router'
import CropperModal from '@/pages/components/CropperModal'
import RedStar from '@/pages/components/common/RedStar'

const EmployeeAgreementForm = ({
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
  const { acceptedJobs, currentFormItem, setCurrentItem } =
    useContext(AuthContext)
  const router = useRouter()
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

  const onSubmit = async data => {
    try {
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
      setFileImage(currentFormItem.data?.image)
      reset(currentFormItem.data)
      setValue('image', '')
    }
  }, [currentFormItem.data])

  const handleObjectLength = obj => Object.keys(obj || {})?.length > 0

  return (
    <div>
      <div className='employee_application_form py-3'>
        <div className='similar_wrapper'>
          <div className='employee_application_form_wrap'>
            <div className='page_title text-center bg-light p-3'>
              <strong className='text-lg text-dark'>
                EMPLOYEE AGREEMENT AND CONSENT TO DRUG AND/OR ALCOHOL TESTING
              </strong>
            </div>

            <div className='text_wrap_row'>
              <p>
                I hereby agree, upon a request made under the drug/alcohol
                testing policy of {acceptedJobs?.Company?.name}, to submit to a
                drug or alcohol test under state law, and to furnish a sample of
                my urine, breath, and/or blood for analysis. I understand and
                agree that if I at any time refuse to submit to a drug or
                alcohol test under company policy, or if I otherwise fail to
                cooperate with the testing procedures, I will be subject to
                immediate termination. I further authorize and give full
                permission to have the Company and/or its company physician send
                the specimen or specimens so collected to a laboratory for a
                screening test for the presence of any prohibited substances
                under the policy, and for the laboratory or other testing
                facility to release any and all documentation relating to such
                test to the Company and/or to any governmental entity involved
                in a legal proceeding or investigation connected with the test.
                Finally, I authorize the Company to disclose any documentation
                relating to such test to any governmental entity involved in a
                legal proceeding or investigation connected with the test.
              </p>

              <p>
                I understand that only duly-authorized Company officers,
                employees, and agents will have access to information furnished
                or obtained in connection with the test; that they will maintain
                and protect the confidentiality of such information to the
                greatest extent possible; and that they will share such
                information only to the extent necessary to make employment
                decisions and to respond to inquiries or notices from government
                entities.
              </p>

              <p>
                I will hold harmless the Company, its company physician, and any
                testing laboratory the Company might use, meaning that I will
                not sue or hold responsible such parties for any alleged harm to
                me that might result from such testing, including loss of
                employment or any other kind of adverse job action that might
                arise as a result of the drug or alcohol test, even if a Company
                or laboratory representative makes an error in the
                administration or analysis of the test or the reporting of the
                results. I will further hold harmless the Company, its company
                physician, and any testing laboratory the Company might use for
                any alleged harm to me that might result from the release or use
                of information or documentation relating to the drug or alcohol
                test, as long as the release or use of the information is within
                the scope of this policy and the procedures as explained in the
                paragraph above.
              </p>

              <p>
                This policy and authorization have been explained to me in a
                language I understand, and I have been told that if I have any
                questions about the test or the policy, they will be answered.
              </p>

              <p>
                I UNDERSTAND THAT THE COMPANY WILL REQUIRE A DRUG SCREEN AND/OR
                ALCOHOL TEST UNDER THIS POLICY WHENEVER I AM INVOLVED IN AN
                ON-THE-JOB ACCIDENT OR INJURY UNDER CIRCUMSTANCES THAT SUGGEST
                POSSIBLE INVOLVEMENT OR INFLUENCE OF DRUGS OR ALCOHOL IN THE
                ACCIDENT OR INJURY EVENT, AND I AGREE TO SUBMIT TO ANY SUCH
                TEST.
              </p>
            </div>

            <div className='text_wrap_row border-0'>
              <div className=' d-flex align-items-center justify-content-between'>
                <div className='form_group d-flex align-items-center flex-grow-1 pe-5'>
                  <label className='me-2'>
                    Employee Signature: <RedStar />
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
                        disabled={formView}
                        accept='image/png, image/jpeg, image/jpg'
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
                        <ErrorMessage message='Please select signature' />
                      )}
                    </div>
                    {preview && handleObjectLength(currentFormItem.data) && (
                      <figure className='upload-img'>
                        <img src={preview} alt='image' />
                      </figure>
                    )}
                  </div>
                </div>

                <div className='form_group d-flex align-items-center'>
                  <label className='me-2'>Date:</label>
                  <div className='position-relative'>
                    <input
                      type='date'
                      disabled={formView}
                      className='form_input'
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
              </div>

              <div className='form_group d-flex align-items-center w-100'>
                <label className='me-2'>
                  Employee Name- Printed: <RedStar />
                </label>
                <div className='position-relative'>
                  <input
                    type='text'
                    disabled={formView}
                    className='form_input flex-grow-1'
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

export default EmployeeAgreementForm
