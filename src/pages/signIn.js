import React, { useContext, useState, useEffect } from 'react'
import { Container, Form, FloatingLabel, Button } from 'react-bootstrap'
import Image from 'next/image'
import Link from 'next/link'
import AuthFooter from './components/AuthFooter'
import ErrorMessage from './components/ErrorMessage'
import { useForm } from 'react-hook-form'
import AuthContext from '@/context/AuthContext'
import { preventMaxInput, validationRules } from '@/utils/constants'
import Header from './components/Header'
import RedStar from './components/common/RedStar'

function SignIn () {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    mode: 'onBlur',
    shouldFocusError: true,
    defaultValues: {}
  })

  const [rememberMe, setRememberMe] = useState(false)
  let { loginUser, showPassword, handleShowPassword } = useContext(AuthContext)

  const handleRememberMe = e => {
    localStorage.setItem('rememberMe', e.target.checked)
    setRememberMe(localStorage.getItem('rememberMe'))
  }

  useEffect(() => {
    setRememberMe(localStorage.getItem('rememberMe'))
  }, [])

  useEffect(() => {
    if (localStorage.getItem('rememberMe')) {
      setValue('email', localStorage.getItem('email'))
      setValue('password', localStorage.getItem('password'))
    }
  }, [])

  const onSubmit = data => {
    if (localStorage.getItem('rememberMe') == 'true') {
      localStorage.setItem('email', data.email)
      localStorage.setItem('password', data.password)
    } else {
      localStorage.removeItem('email')
      localStorage.removeItem('password')
    }
    loginUser({
      ...data,
      deviceId: localStorage.getItem('fcm'),
      deviceType: 'web',
      deviceToken: localStorage.getItem('fcm')
    })
  }

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
                    <h3>Sign In</h3>
                    <p>Welcome back continue to sign in</p>
                  </div>
                  <Link to='/signUp' href='/signUp' className='fw-600'>
                    Sign Up
                    <Image src='/images/Vector.png' width={17} height={12} />
                  </Link>
                </div>

                <Form onSubmit={handleSubmit(onSubmit)} method='post'>
                  <div className='theme-form-group'>
                    <figure className='form_icon'>
                      <Image
                        src='/images/email.svg'
                        width={20}
                        height={17}
                        alt=''
                      />
                    </figure>
                    <FloatingLabel
                      controlId='floatingInput'
                      label={
                        <p>
                          Email address <RedStar />
                        </p>
                      }
                      className=''
                    >
                      <Form.Control
                        type='text'
                        placeholder='Email address'
                        onInput={e => preventMaxInput(e)}
                        {...register('email', {
                          required: 'Please enter email address.',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address.'
                          }
                        })}
                      />
                      <ErrorMessage message={errors?.email?.message} />
                    </FloatingLabel>
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
                            Password <RedStar />
                          </p>
                        }
                        className=''
                      >
                        <Form.Control
                          type={!showPassword && 'password'}
                          placeholder='Password'
                          className='border-end-0'
                          name='password'
                          maxLength={16}
                          minLength={8}
                          onInput={e => preventMaxInput(e)}
                          {...register('password', {
                            required: 'Please enter password.',
                            validate: value => {
                              if (value === '') {
                                return true
                              }
                              if (!!value.trim()) {
                                return true
                              }
                            },
                            pattern: {
                              value: validationRules.password,
                              message:
                                'Password must contain lowercase,uppercase characters, numbers, special character and must be 8 character long.'
                            },
                            maxLength: {
                              value: 16,
                              message: 'Maximum length must be 16.'
                            }
                          })}
                        />
                        {showPassword ? (
                          <span
                            className='input_grp'
                            onClick={() => handleShowPassword()}
                          >
                            {' '}
                            <Image
                              src='/images/hide.png'
                              width={24}
                              height={24}
                              alt=''
                            />
                          </span>
                        ) : (
                          <span
                            className='input_grp'
                            onClick={() => handleShowPassword()}
                          >
                            {' '}
                            <Image
                              src='/images/eye.svg'
                              width={24}
                              height={24}
                              alt=''
                            />
                          </span>
                        )}
                      </FloatingLabel>
                      <ErrorMessage message={errors?.password?.message} />
                    </div>
                  </div>

                  <div className='remember_forgot d-flex align-items-center justify-content-between mb-4'>
                    <Form.Check
                      type='checkbox'
                      label='Remember me'
                      className='fw-bold text-black d-flex align-items-center'
                      checked={rememberMe == 'true' ? true : false}
                      onChange={e => handleRememberMe(e)}
                    />
                    <Link href='/forgotPassword' className='orange_link fw-600'>
                      Forgot Password?
                    </Link>
                  </div>

                  <Button type='submit' className='theme_blue_btn'>
                    Sign in
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

export default SignIn
