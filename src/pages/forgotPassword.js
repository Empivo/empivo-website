import React from 'react'
import { Container, Form, FloatingLabel, Button } from 'react-bootstrap'
import Image from 'next/image'
import AuthFooter from './components/AuthFooter'
import ErrorMessage from './components/ErrorMessage'
import { useForm } from 'react-hook-form'
import { preventMaxInput } from '@/utils/constants'
import { apiPost } from '@/utils/apiFetch'
import apiPath from '@/utils/pathObj'
import useToastContext from '@/hooks/useToastContext'
import Header from './components/Header'
import RedStar from './components/common/RedStar'

function ForgotPassword () {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    mode: 'onBlur',
    shouldFocusError: true,
    defaultValues: {}
  })
  const notification = useToastContext()

  const onSubmit = async body => {
    const { status, data } = await apiPost(apiPath.forgotPassword, body)
    if (status === 200) {
      if (data.success) {
        notification.success(data.message)
        reset()
      } else {
        notification.error(data.message)
      }
    } else {
      notification.error(data.message)
    }
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
                    <h3>Forgot password</h3>
                  </div>
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
                        id='email'
                        type='text'
                        placeholder='Enter email'
                        onInput={e => preventMaxInput(e)}
                        {...register('email', {
                          required: 'Please enter email.',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address.'
                          }
                        })}
                      />
                      <ErrorMessage message={errors?.email?.message} />
                    </FloatingLabel>
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

export default ForgotPassword
