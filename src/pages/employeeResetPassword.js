import React, { useState, useEffect } from 'react'
import { Container, Form, FloatingLabel, Button } from 'react-bootstrap'
import Image from 'next/image'
import AuthFooter from './components/AuthFooter'
import ErrorMessage from './components/ErrorMessage'
import { useForm } from 'react-hook-form'
import { preventMaxInput, validationRules } from '@/utils/constants'
import apiPath from '@/utils/pathObj'
import { apiPost } from '@/utils/apiFetch'
import useToastContext from '@/hooks/useToastContext'
import { useRouter } from 'next/router'
import { isEmpty } from 'lodash'
import Header from './components/Header'
import RedStar from './components/common/RedStar'
import Helpers from '@/utils/helpers'

function EmployeeResetPassword () {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    reset,
    formState: { errors }
  } = useForm({
    mode: 'onBlur',
    shouldFocusError: true,
    defaultValues: {}
  })
  const notification = useToastContext()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [conPassToggle, setConPassTogle] = useState(false)

  const onSubmit = async body => {
    const { status, data } = await apiPost(
      apiPath.resetPassword + '/' + router.query.token,
      {
        password: body.password
      }
    )
    if (status === 200) {
      if (data.success) {
        notification.success(data.message)
        reset()
        router.push('/signIn')
      } else {
        notification.error(data.message)
      }
    } else {
      notification.error(data.message)
    }
  }

  const inputType = Helpers.ternaryCondition(showPassword, 'text', 'password')
  const confirmInputType = Helpers.ternaryCondition(
    conPassToggle,
    'text',
    'password'
  )

  useEffect(() => {
    if (!isEmpty(watch('confirmPassword'))) {
      if (watch('password')) {
        trigger('confirmPassword')
      }
    }
  }, [watch('password')])

  return (
    <>
      <Header />
      <div className='auth_body' style={{ background: '#FBFBFE' }}>
        <section className='page_title_bar'></section>
        <section className='auth_section'>
          <Container>
            <div className='auth_section_row'>
              <div className='auth_left login_page_left'>
                <div className='auth_head'>
                  <div>
                    <h3>Reset password</h3>
                  </div>
                </div>
                <Form onSubmit={handleSubmit(onSubmit)} method='post'>
                  <div className='theme-form-group'>
                    <figure className='form_icon'>
                      <Image
                        src='/images/lock.svg'
                        width={20}
                        height={17}
                        alt=''
                      />
                    </figure>
                    <div className='w-100'>
                      <FloatingLabel
                        controlId='floatingInput'
                        label={
                          <p>
                            Password <RedStar />
                          </p>
                        }
                        className=''
                      >
                        <Form.Control
                          type={inputType}
                          placeholder='Enter password'
                          maxLength={16}
                          onInput={e => preventMaxInput(e)}
                          {...register('password', {
                            required: 'Please enter password.',
                            validate: value => {
                              if (value === '') {
                                return true
                              }
                              if (!value.trim()) {
                                return true
                              }
                            },
                            pattern: {
                              value: validationRules.password,
                              message:
                                'Password must contain lowercase, uppercase characters, numbers, special character and must be 8 characters long.'
                            },
                            maxLength: {
                              value: 16,
                              message: 'Maximum length must be 16.'
                            }
                          })}
                        />
                        <span
                          className='input_grp'
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {' '}
                          <Image
                            src={Helpers.ternaryCondition(
                              showPassword,
                              '/images/hide.png',
                              '/images/eye.svg'
                            )}
                            width={24}
                            height={24}
                            alt=''
                          />
                        </span>
                      </FloatingLabel>
                      <ErrorMessage message={errors?.password?.message} />
                    </div>
                  </div>
                  <div className='theme-form-group'>
                    <figure className='form_icon'>
                      <Image
                        src='/images/lock.svg'
                        width={20}
                        height={17}
                        alt=''
                      />
                    </figure>
                    <div className='w-100'>
                      <FloatingLabel
                        controlId='floatingInput'
                        label={
                          <p>
                            Confirm password <RedStar />
                          </p>
                        }
                        className=''
                      >
                        <Form.Control
                          placeholder='Enter confirm password'
                          onInput={e => preventMaxInput(e)}
                          maxLength={16}
                          type={confirmInputType}
                          {...register('confirmPassword', {
                            required: {
                              value: true,
                              message: 'Please enter confirm password.'
                            },
                            validate: val => {
                              if (watch('password') !== val) {
                                return 'Your password do not match.'
                              }
                            },
                            maxLength: {
                              value: 16,
                              message: 'Maximum length must be 16.'
                            }
                          })}
                          onChange={e => {
                            setValue('confirmPassword', e.target.value, {
                              shouldValidate: true
                            })
                          }}
                        />
                        <span
                          className='input_grp'
                          onClick={() => setConPassTogle(!conPassToggle)}
                        >
                          {' '}
                          <Image
                            src={Helpers.ternaryCondition(
                              conPassToggle,
                              '/images/hide.png',
                              '/images/eye.svg'
                            )}
                            width={24}
                            height={24}
                            alt=''
                          />
                        </span>
                      </FloatingLabel>
                      <ErrorMessage
                        message={errors?.confirmPassword?.message}
                      />
                    </div>
                  </div>
                  <Button type='submit' className='theme_blue_btn'>
                    Submit
                  </Button>
                </Form>
              </div>

              <div className='auth_right'>
                <figure>
                  <Image
                    src='/images/auth.png'
                    width={448}
                    height={407}
                    alt=''
                  />
                </figure>
              </div>
            </div>

            <AuthFooter />
          </Container>
        </section>
      </div>
    </>
  )
}

export default EmployeeResetPassword
