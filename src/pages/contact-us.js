import React from 'react'
import {
  Button,
  Col,
  Container,
  FloatingLabel,
  Form,
  Row
} from 'react-bootstrap'
import ErrorMessage from './components/ErrorMessage'
import RedStar from './components/common/RedStar'
import { useForm } from 'react-hook-form'
import { preventMaxInput, validationRules } from '@/utils/constants'
import useToastContext from '@/hooks/useToastContext'
import { apiPost } from '@/utils/apiFetch'
import apiPath from '@/utils/pathObj'
import { BiMessage } from 'react-icons/bi'
import { FaMobileAlt, FaRegUserCircle } from 'react-icons/fa'
import { MdOutlineEmail } from 'react-icons/md'
import AddressMap from './components/reusable/AddressMap'

const ContactUs = () => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm()
  const notification = useToastContext()

  const onSubmit = async data => {
    try {
      const payload = {
        fullName: data.fullName,
        email: data.email,
        mobile: data.mobile,
        message: data.message
      }
      const res = await apiPost(apiPath.contactUs, payload)
      if (res?.data?.success) {
        reset()
        notification.success(res?.data?.message)
      } else {
        notification.error(res?.data?.message)
      }
    } catch (err) {
      console.log('err:', err)
    }
  }
  return (
    <>
      <div className='main_wrap blog_detail contact-us-page'>
        <Container>
          <div className=''>
            <div className='border-0 bg-white  w-100 p-4'>
              <div className='pb-sm-4 card-body'>
                <h2 className='mb-3 mb-lg-4 text-center text-black'>
                  Contact <span className='text-orange'>us</span>
                </h2>
                <p className='text-center mb-md-4 mb-3'>
                  Keen to explore how Empivo can enhance your business
                  operations? Contact us today to engage with one of our
                  representatives. Whether you seek clarification on our product
                  offerings, pricing structures, or implementation processes,
                  our team stands ready to assist you in unlocking the full
                  potential of Empivo&apos;s HR solutions.
                </p>

                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Row>
                    <Col md={6}>
                      <AddressMap setValue={setValue} />
                    </Col>
                    <Col md={6}>
                      <div>
                        <div className='theme-form-group mb-3'>
                          <figure className='form_icon'>
                            <FaRegUserCircle className='form_icon_color' />
                          </figure>
                          <FloatingLabel
                            controlId='floatingInput'
                            label={
                              <p>
                                Full Name
                                <RedStar />
                              </p>
                            }
                            className='star_red'
                          >
                            <Form.Control
                              type='text'
                              placeholder='Full Name'
                              maxLength={15}
                              onInput={e => preventMaxInput(e, 15)}
                              {...register('fullName', {
                                required: 'Please enter full name.',
                                pattern: {
                                  value: validationRules.characters,
                                  message: validationRules.charactersMessage
                                },
                                minLength: {
                                  value: 2,
                                  message: 'Minimum length must be 2.'
                                }
                              })}
                            />
                            <ErrorMessage message={errors?.fullName?.message} />
                          </FloatingLabel>
                        </div>

                        <div className='theme-form-group mb-3'>
                          <figure className='form_icon'>
                            <MdOutlineEmail className='form_icon_color' />
                          </figure>
                          <FloatingLabel
                            controlId='floatingInput'
                            label={
                              <p>
                                Email ID
                                <RedStar />
                              </p>
                            }
                            className='star_red'
                          >
                            <Form.Control
                              type='text'
                              placeholder='Email ID'
                              maxLength={50}
                              onInput={e => preventMaxInput(e, 50)}
                              {...register('email', {
                                required: 'Please enter email ID.',
                                pattern: {
                                  value:
                                    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                  message:
                                    'Please enter valid email ID as: example@domain.com.'
                                }
                              })}
                            />
                            <ErrorMessage message={errors?.email?.message} />
                          </FloatingLabel>
                        </div>
                        <div className='theme-form-group mb-3'>
                          <figure className='form_icon'>
                            <FaMobileAlt className='form_icon_color' />
                          </figure>
                          <FloatingLabel
                            controlId='floatingInput'
                            label={
                              <p>
                                Mobile
                                <RedStar />
                              </p>
                            }
                            className='star_red'
                          >
                            <Form.Control
                              type='number'
                              placeholder='Mobile'
                              min={0}
                              onKeyDown={e => {
                                if (['-', '+', 'e'].includes(e.key)) {
                                  e.preventDefault()
                                }
                              }}
                              onInput={e => preventMaxInput(e, 15)}
                              {...register('mobile', {
                                required: 'Please enter mobile.',
                                minLength: {
                                  value: 7,
                                  message: 'Minimum length should be 7 digits.'
                                },
                                min: {
                                  value: 0,
                                  message: 'Minimum value must is 0.'
                                },
                                maxLength: {
                                  value: 15,
                                  message: 'Maximum length should be 15 digits.'
                                }
                              })}
                            />
                            <ErrorMessage message={errors?.mobile?.message} />
                          </FloatingLabel>
                        </div>
                        <div className='theme-form-group mb-4 textarea-sec'>
                          <figure className='form_icon'>
                            <BiMessage className='form_icon_color' />
                          </figure>
                          <FloatingLabel
                            controlId='floatingInput'
                            label={
                              <p>
                                Message
                                <RedStar />
                              </p>
                            }
                            className='star_red'
                          >
                            <Form.Control
                              as='textarea'
                              rows={2}
                              placeholder='Message'
                              maxLength={300}
                              onInput={e => preventMaxInput(e, 300)}
                              {...register('message', {
                                required: 'Please enter message.',
                                minLength: {
                                  value: 3,
                                  message: 'Minimum length must be 3.'
                                },
                                maxLength: {
                                  value: 300,
                                  message: 'Maximum length must be 300.'
                                }
                              })}
                            />
                            <ErrorMessage message={errors?.message?.message} />
                          </FloatingLabel>
                        </div>
                        <div>
                          <Button
                            className='theme_md_blue_btn contact_button m-auto d-block w-100'
                            type='submit'
                          >
                            Submit
                          </Button>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Form>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  )
}
export default ContactUs
