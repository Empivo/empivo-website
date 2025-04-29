import React from 'react'
import {
  Button,
  Col,
  Container,
  FloatingLabel,
  Form,
  Row
} from 'react-bootstrap';
import Link from 'next/link';
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
 
      <section className="contact-banner">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/">Home</Link>
                
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Contact Us
              </li>
            </ol>
          </nav>
          <div className="gettouch">
            <h1>GET IN TOUCH</h1>
          </div>
        </div>
      </section>
      <section className="contact-detail">
        <div className="container">
          <div className="contactmain-box">
            <div className="contact-box">
              <div className="contactbox1">
                <img src="images/smartphone 1.png" alt="Phone" />
                <div className="detail-part">
                  <p>
                    <span>Call Us:-</span>
                    <a href="tel:+5574556111123">+55 74556111123</a>
                  </p>
                </div>
              </div>
              <div className="contactbox1">
                <img src="images/email 1.png" alt="Email" />
                <div className="detail-part">
                  <p>
                    <span>Email:- </span>
                    <a href="mailto:support@empivo.com">support@empivo.com</a>
                  </p>
                </div>
              </div>
            </div>
            <div className="contact-from-part">
              <div className="row">
                <div className="col-md-6">
                  <div className="contact-left">
                    <p>
                      Keen to explore how Empivo can enhance your business
                      operations? Contact us today to engage with one of our
                      representatives. Whether you seek clarification on our product
                      offerings, pricing structures, or implementation processes,
                      our team stands ready to assist you in unlocking the full
                      potential of Empivo's HR solutions.
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="contact-form1">
                    <Form onSubmit={handleSubmit(onSubmit)}>
                      <div className="theme-form-group mb-3">
                        <FloatingLabel
                          controlId="floatingName"
                          label={
                            <p>
                              Name
                              <RedStar />
                            </p>
                          }
                          className="star_red"
                        >
                          <Form.Control
                            type="text"
                            placeholder="Name"
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

                      <div className="theme-form-group mb-3">
                        <FloatingLabel
                          controlId="floatingEmail"
                          label={
                            <p>
                              Email
                              <RedStar />
                            </p>
                          }
                          className="star_red"
                        >
                          <Form.Control
                            type="text"
                            placeholder="Email"
                            maxLength={50}
                            onInput={e => preventMaxInput(e, 50)}
                            {...register('email', {
                              required: 'Please enter email ID.',
                              pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Please enter valid email ID as: example@domain.com.'
                              }
                            })}
                          />
                          <ErrorMessage message={errors?.email?.message} />
                        </FloatingLabel>
                      </div>

                      <div className="theme-form-group mb-3">
                        <FloatingLabel
                          controlId="floatingMobile"
                          label={
                            <p>
                              Mobile
                              <RedStar />
                            </p>
                          }
                          className="star_red"
                        >
                          <Form.Control
                            type="number"
                            placeholder="Mobile"
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

                      <div className="theme-form-group mb-4 textarea-sec">
                        <FloatingLabel
                          controlId="floatingMessage"
                          label={
                            <p>
                              Message
                              <RedStar />
                            </p>
                          }
                          className="star_red"
                        >
                          <Form.Control
                            as="textarea"
                            rows={2}
                            placeholder="Message"
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

                      <Button
                        className="theme_md_blue_btn contact_button w-100"
                        type="submit"
                      >
                        Submit
                      </Button>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
            <div className="map-part">
              <AddressMap setValue={setValue} />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default ContactUs