import React, { useState, useEffect, useContext, useRef } from 'react'
import { useForm } from 'react-hook-form'
import ErrorMessage from '@/pages/components/ErrorMessage'
import { preventMaxInput } from '@/utils/constants'
import AuthContext from '@/context/AuthContext'
import apiPath from '@/utils/pathObj'
import { apiPost, apiPut } from '@/utils/apiFetch'
import useToastContext from '@/hooks/useToastContext'
import { useRouter } from 'next/router'
import SignPage from '@/pages/components/SignPage'
import RedStar from '@/pages/components/common/RedStar'

const BackgroundReleaseForm = ({
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
    image: null,
    contractorSign: null
  })
  const [src, setSrc] = useState(null)
  const [imageName, setImageName] = useState({
    image: null,
    contractorSign: null
  })
  const [imageData, setImageData] = useState({
    image: null,
    contractorSign: null
  })
  const [modalOpen, setModalOpen] = useState({
    image: false,
    contractorSign: false
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

  const [checkboxes, setCheckboxes] = useState([
    { label: 'Yes', value: false },
    { label: 'No', value: false }
  ])

  const onSubmit = async data => {
    try {
      data.applicants = checkboxes?.find(i => i.value === true)?.label || ''
      let payload = {
        jobID: acceptedJobs?.Job?._id,
        companyID: acceptedJobs?.companyID,
        formType: formCategoryType,
        content: {
          ...data,
          image: JSON.stringify({ image: imageData.image }),
          contractorSign: JSON.stringify({
            contractorSign: imageData.contractorSign
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
  const handleCheckboxChange = index => {
    let checkbox = [...checkboxes]
    checkbox?.map(i => (i.value = false))
    checkbox[index].value = !checkbox[index].value
    setCheckboxes(checkbox)
  }
  const commonFunction = (check, setState, value) => {
    let checkBox = [...check]
    const i = checkBox.findIndex(item => item.label === value)
    if (i !== -1) checkBox[i].value = true
    setState(checkBox)
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
      commonFunction(
        checkboxes,
        setCheckboxes,
        currentFormItem.data?.applicants
      )
      setFileImage(
        'image',
        currentFormItem.data?.image,
        'contractorSign',
        currentFormItem.data?.contractorSign
      )
      reset(currentFormItem.data)
      setValue('image', '')
      setValue('contractorSign', '')
    }
  }, [currentFormItem.data])

  const handleObjectLength = obj => Object.keys(obj || {})?.length

  return (
    <div>
      <div className='employee_application_form py-3'>
        <div className='similar_wrapper'>
          <div className='employee_application_form_wrap'>
            <div className='page_title text-center bg-light p-3'>
              <strong className='text-lg text-dark'>
                Background Release Form <br />
                Disclosure and Consent
              </strong>
            </div>

            <div className='text_wrap_row'>
              <p>
                In connection with my application for employment (including
                contract for service) with {acceptedJobs?.Company?.name}, I
                understand that investigative inquiries may be obtained on
                myself by a consumer reporting agency, and that any such report
                will be used solely for employment-related purposes. I
                understand that the nature and scope of this investigation will
                include a number of sources including, but not limited to,
                consumer credit, criminal convictions, motor vehicle, and other
                reports. These reports will include information as to my
                character, general reputation, personal characteristics, mode of
                living, and work habits. Information relating to my performance
                and experience, along with reasons for termination of past
                employment from previous employers, may also be obtained.
                Further, I understand that you will be requesting information
                from various Federal, State, County and other agencies that
                maintain records concerning my past activities relating to my
                driving, credit, criminal, civil, education, and other
                experiences.
              </p>

              <p>
                I understand that if the Company hires me, it may request a
                consumer report or an investigative consumer report about me for
                employment-related purposes during the course of my employment.
                The scope of this investigation will be the same as the scope of
                a pre-employment investigation, and that the nature of such an
                investigation will be my continuing suitability for employment,
                or whether I possess the minimum qualifications necessary for
                promotion or transfer to another position. I understand that my
                consent will apply throughout my employment, unless I revoke or
                cancel my consent by sending a signed letter or statement to the
                Company at any time, stating that I revoke my consent and no
                longer allow the Company to obtain consumer or investigative
                consumer reports about me.
              </p>

              <p>
                I understand that I am being given a copy of the “Summary of
                Your Rights Under the Fair Credit Reporting Act” prepared
                pursuant to 15 U.S.C. Section 1681-1681u. If I am applying for
                employment in the State of California or if I am a resident of
                California at the time of applying for employment, a summary of
                the provisions of California Civil Code section 1786.22 is also
                being provided to me with this form. This Disclosure and Consent
                form, in original, faxed, photocopied or electronic form, will
                be valid for any reports that may be requested by the Company.
              </p>

              <p>
                I authorize without reservation any party or agency contacted by
                this employer to furnish the above-mentioned information. I
                hereby consent to your obtaining the above information from a
                consumer reporting agency. I understand to aid in the proper
                identification of my file or records the following personal
                identifiers, as well as other information, is necessary.
              </p>
            </div>

            <div className='text_wrap_row border-0'>
              <div className=''>
                <div className='form_group d-flex align-items-center flex-grow-1 pe-5'>
                  <label className='me-2'>
                    Print Name <RedStar />
                  </label>
                  <div className='position-relative'>
                    <input
                      type='text'
                      disabled={formView}
                      className='form_input w-100'
                      maxLength={15}
                      onInput={e => preventMaxInput(e, 15)}
                      {...register('printName', {
                        required: {
                          value: true,
                          message: 'Please enter print name.'
                        },
                        minLength: {
                          value: 2,
                          message: 'Minimum length must be 2.'
                        },
                        maxLength: {
                          value: 15,
                          message: 'Minimum length must be 15.'
                        }
                      })}
                    />
                    <ErrorMessage message={errors?.printName?.message} />
                  </div>
                </div>

                <div className='form_group d-flex align-items-center flex-grow-1'>
                  <label className='me-2'>Other Names Known By:</label>
                  <input
                    type='text'
                    disabled={formView}
                    className='form_input w-100'
                    maxLength={15}
                    onInput={e => preventMaxInput(e, 15)}
                    {...register('otherNames', {
                      // required: {
                      //   value: true,
                      //   message: 'Please enter other names known by.'
                      // },
                      minLength: {
                        value: 2,
                        message: 'Minimum length must be 2.'
                      },
                      maxLength: {
                        value: 15,
                        message: 'Minimum length must be 15.'
                      }
                    })}
                  />
                  <ErrorMessage message={errors?.otherNames?.message} />
                </div>

                <div className='d-flex justify-content-between'>
                  <div className='form_group d-flex align-items-center flex-grow-1 pe-3'>
                    <label className='me-2'>
                      Social Security Number: <RedStar />
                    </label>
                    <div className='position-relative'>
                      <input
                        type='number'
                        disabled={formView}
                        className='form_input w-100'
                        maxLength={4}
                        onKeyDown={event => {
                          if (
                            !['Backspace', 'Delete', 'Tab'].includes(
                              event.key
                            ) &&
                            !/[0-9]/.test(event.key)
                          ) {
                            event.preventDefault()
                          }
                        }}
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

                  <div className='form_group d-flex align-items-center'>
                    <label className='me-2'>
                      Date of Birth: <RedStar />
                    </label>
                    <div className='position-relative'>
                      <input
                        type='date'
                        disabled={formView}
                        className='form_input'
                        //min={new Date().toISOString().split('T')[0]}
                        {...register('dob', {
                          required: {
                            value: true,
                            message: 'Please enter dob.'
                          }
                        })}
                      />
                      <ErrorMessage message={errors?.dob?.message} />
                    </div>
                  </div>
                </div>

                <div className='d-flex justify-content-between'>
                  <div className='form_group d-flex align-items-center flex-grow-1 pe-3'>
                    <label className='me-2'>
                      Driver License Number: <RedStar />
                    </label>
                    <div className='position-relative'>
                      <input
                        type='text'
                        disabled={formView}
                        className='form_input w-100'
                        maxLength={16}
                        {...register('licenseNumber', {
                          required: {
                            value: true,
                            message: 'Please enter driver license number.'
                          },
                          minLength: {
                            value: 10,
                            message: 'Minimum length must be 10.'
                          },
                          maxLength: {
                            value: 16,
                            message: 'Minimum length must be 16.'
                          }
                        })}
                      />
                      <ErrorMessage message={errors?.licenseNumber?.message} />
                    </div>
                  </div>

                  <div className='form_group d-flex align-items-center'>
                    <label className='me-2'>
                      State: <RedStar />
                    </label>
                    <div className='position-relative'>
                      <input
                        type='text'
                        disabled={formView}
                        className='form_input'
                        maxLength={15}
                        onInput={e => preventMaxInput(e, 15)}
                        {...register('state', {
                          required: {
                            value: true,
                            message: 'Please enter state.'
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
                      <ErrorMessage message={errors?.state?.message} />
                    </div>
                  </div>
                </div>

                <div className='form_group d-flex align-items-center flex-grow-1'>
                  <label className='me-2'>
                    Current Address: <RedStar />
                  </label>
                  <div className='position-relative w-100'>
                    <input
                      type='text'
                      disabled={formView}
                      className='form_input w-100'
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

                <div className='d-flex'>
                  <div className='form_group d-flex align-items-center flex-grow-1 pe-3'>
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
                      ZIP: <RedStar />
                    </label>
                    <div className='position-relative'>
                      <input
                        type='number'
                        disabled={formView}
                        className='form_input'
                        maxLength={6}
                        onInput={e => preventMaxInput(e, 6)}
                        {...register('zip', {
                          required: {
                            value: true,
                            message: 'Please enter zip.'
                          },
                          minLength: {
                            value: 6,
                            message: 'Minimum length must be 6.'
                          },
                          maxLength: {
                            value: 6,
                            message: 'Maximum length must be 6.'
                          }
                        })}
                      />
                      <ErrorMessage message={errors?.zip?.message} />
                    </div>
                  </div>
                </div>

                <div className='d-flex justify-content-between'>
                  <div className='form_group d-flex align-items-center flex-grow-1'>
                    <label className='me-2'>
                      Applicant Signature: <RedStar />
                    </label>
                    <SignPage
                      imageName={imageName.image}
                      register={register('image', {
                        required: {
                          value: preview.image ? false : true,
                          message: 'Please select signature'
                        }
                      })}
                      imageRef={imageRef1}
                      formView={formView}
                      handleImgChange={handleImgChange}
                      modalOpen={modalOpen}
                      handleSave={handleSave}
                      src={src}
                      text={'image'}
                      image={preview?.image}
                      errorCond={errors?.image}
                      imageShow={handleObjectLength(currentFormItem.data)}
                      errors={<ErrorMessage message='Please select image' />}
                    />
                  </div>

                  <div className='form_group d-flex align-items-center'>
                    <label className='me-2'>
                      Date: <RedStar />
                    </label>
                    <div className='position-relative'>
                      <input
                        type='date'
                        disabled={formView}
                        className='form_input'
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

                <div className='mt-3'>
                  <strong className='d-block mb-2'>
                    California, Oklahoma, or Minnesota Applicants:
                  </strong>
                  <span>
                    I would like to receive a copy of any report obtained on me
                    by {acceptedJobs?.Company?.name}.
                  </span>

                  <div className='d-flex'>
                    {checkboxes?.map((item, index) => (
                      <>
                        <label className='me-2'>
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
                </div>
              </div>
            </div>

            <div className='page_title text-center bg-light p-3'>
              <strong className='text-lg text-dark'>
                BACKGROUND CHECK DISCLOSURE AND AUTHORIZATION FORM
              </strong>
            </div>
            <div className='text_wrap_row border-0'>
              <p>
                In the interest of maintaining the safety and security of their
                employees, clients, and their clients’ employees, our client has
                requested that we, {acceptedJobs?.Company?.name}, procure a
                consumer report and/or investigative consumer report
                (“background check report”) on you in connection with your
                employment application, and if you are hired, may procure
                additional background check reports on you for employment
                purposes.
              </p>
              <p>
                You may request more information about the nature and scope of
                any background check reports by contacting{' '}
                {acceptedJobs?.Company?.name}. A summary of your rights under
                the Fair Credit Reporting Act is also being provided to you with
                this form.
              </p>

              <p>
                <strong className='text-dark'>State Law Notices:</strong> If you
                live, or are seeking work, in California, Maine, N.Y. or
                Washington State, please note the following information:
              </p>

              <p>
                <strong className='text-dark'>CALIFORNIA:</strong> The
                Investigative Consumer Reporting Agencies Act (ICRAA) is
                designed to promote accuracy, fairness, and privacy of
                information in the files of every “investigative consumer
                reporting agency.” The ICRAA gives you specific rights,
                including those outlined below. You may have additional rights
                under federal law. California Civil Code section 1786.10
                requires an investigative consumer reporting agency to allow a
                consumer to visually inspect all files maintained regarding the
                consumer at the time of the request. Certain information
                regarding the sources of information used for a report is
                excluded. Under California Civil Code section 1786.22, an
                investigative consumer reporting agency shall supply files and
                information about you, the consumer, during normal business
                hours and on reasonable notice. The investigative consumer
                reporting agency will make files maintained on you available for
                visual inspection in the following ways:{' '}
              </p>

              <ol>
                <li>
                  In person, if you appear in person and furnish proper
                  identification. A copy of the file will also be available to
                  you for a fee not to exceed the actual cost of copying.{' '}
                </li>

                <li>
                  By certified mail, if you make a written request, with proper
                  identification, for copies to be sent to a specified address.
                  However, agencies complying with a request for such a mailing
                  will not be liable for disclosures to third parties caused by
                  mishandling of mail after it leaves the agency.
                </li>

                <li>
                  By telephone. A summary of all information contained in your
                  file and required to be provided to you under Section 1786.10
                  will be provided by telephone, if you have made a written
                  request, with proper identification for telephone disclosure,
                  and the toll charge, if any, for the telephone call is prepaid
                  by or charged directly to you.
                </li>
              </ol>

              <p>
                The term “proper identification” means information generally
                deemed sufficient to identify a person. This includes documents
                such as a valid driver’s license, social security account
                number, military identification card, and credit cards. Only if
                you are unable to reasonably identify yourself with the
                information described above, may an investigative consumer
                reporting agency require additional information concerning your
                employment and personal or family history in order to verify
                your identity
              </p>

              <p>
                The investigative consumer reporting agency shall also provide
                trained personnel to explain any information provided to you.{' '}
              </p>

              <p>
                The investigative consumer reporting agency shall provide a
                written explanation of any coded information contained in files
                maintained on you. This written explanation shall be distributed
                whenever a file is provided to you for visual inspection as
                required under Section 1786.22. You will be permitted to be
                accompanied by one other person of your choosing, who shall
                furnish reasonable identification. The investigative consumer
                reporting agency may require you to furnish a written statement
                granting permission to the agency to discuss your file in such
                person’s presence.
              </p>

              <p>
                <strong className='text-dark'>MAINE:</strong> Under Chapter 210
                Section 1314 of Maine Revised Statutes, you have the right, upon
                request, to be informed within 5 business days of such request
                of whether or not an investigative consumer report was
                requested. If such report was obtained, you may contact the
                Consumer Reporting Agency and request a copy.
              </p>

              <p>
                <strong className='text-dark'>NEW YORK:</strong> Under Article
                25 Section 380-c (b) (2) of the New York General Business Law,
                you have the right, upon written request, to be informed of
                whether or not an investigative consumer report was requested.
              </p>

              <p>
                Under Article 25 Section 380-g of the New York General Business
                Law, should a consumer report received by an employer contain
                criminal conviction information, the employer must provide to
                the applicant or employee who is the subject of the report, a
                printed or electronic copy of Article 23-A of the New York
                Correction Law, which governs the employment of persons
                previously convicted of one or more criminal offenses.
              </p>

              <p>
                <strong className='text-dark'>WASHINGTON STATE:</strong> You
                have the right, upon written request made within a reasonable
                period of time after your receipt of this disclosure, to receive
                from the Company a complete and accurate disclosure of the
                nature and scope of the investigation we requested. You also
                have the right to request from the consumer reporting agency a
                written summary of your rights and remedies under the Washington
                Fair Credit Reporting Act.
              </p>
            </div>

            <div className='page_title text-center bg-light p-3'>
              <strong className='text-lg text-dark'>
                CONSENT FOR DISCLOSURE OF BACKGROUND CHECK INFORMATION
              </strong>
            </div>
            <div className='text_wrap_row border-0'>
              <p>
                Workplace safety and security is of fundamental importance for{' '}
                {acceptedJobs?.Company?.name} and its clients. As part of the
                efforts to promote safety and security, many clients require
                {acceptedJobs?.Company?.name} to verify and/or disclose employee
                BACKGROUND CHECK INFORMATION, particularly when employees are
                performing on-site services. Requests for such information have
                increased considerably due to recent events, including the
                events of September 11, 2001.
              </p>

              <p>
                BACKGROUND CHECK INFORMATION includes, but is not limited to:
                civil and criminal court records; credit history information;
                educational records; driving records; reference checks; military
                records; and pre-employment drug test results.
              </p>

              <p>
                {acceptedJobs?.Company?.name} respects your privacy. However,{' '}
                {acceptedJobs?.Company?.name} must balance your privacy
                interests with the realities of doing business with our clients.
                For that reason, {acceptedJobs?.Company?.name} is asking you to
                consent to the disclosure of your BACKGROUND CHECK INFORMATION
                to {acceptedJobs?.Company?.name} by marking the box below and
                signing and returning the form. Information will only be
                disclosed when required by the client, and disclosure will be
                limited to authorized individuals at the client’s facilities.
                Measures will be taken to preserve your privacy.
              </p>

              <p>
                Questions about this form should be directed to{' '}
                {acceptedJobs?.Company?.name} Human Resources Department at
                [Employer Phone Number].
              </p>

              <p>
                I consent to the disclosure of my BACKGROUND CHECK INFORMATION
                to authorized personnel at {acceptedJobs?.Company?.name} and
                understand that my consent will be good throughout my
                employment.
              </p>
            </div>

            <div className='text_wrap_row form_footer d-flex align-content-between justify-content-between'>
              <strong>
                Signature of Applicant/Contractor: <RedStar />
              </strong>
              <SignPage
                imageName={imageName.contractorSign}
                register={register('contractorSign', {
                  required: {
                    value: preview.contractorSign ? false : true,
                    message: 'Please select signature'
                  }
                })}
                imageRef={imageRef2}
                handleImgChange={handleImgChange}
                modalOpen={modalOpen}
                formView={formView}
                handleSave={handleSave}
                src={src}
                text={'contractorSign'}
                image={preview?.contractorSign}
                errorCond={errors?.contractorSign}
                imageShow={handleObjectLength(currentFormItem.data)}
                errors={
                  <ErrorMessage message='Please select contractorSign.' />
                }
              />
              <div className='form_group d-flex align-items-center'>
                <label className='me-2'>Date:</label>
                <div className='position-relative'>
                  <input
                    type='date'
                    disabled={formView}
                    className='form_input'
                    min={new Date().toISOString().split('T')[0]}
                    {...register('contractorDate', {
                      // required: {
                      //   value: true,
                      //   message: 'Please enter date.'
                      // }
                    })}
                  />
                  {/* <ErrorMessage message={errors?.contractorDate?.message} /> */}
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

export default BackgroundReleaseForm
