import React from 'react'
import { Container, Card } from 'react-bootstrap'
import FormComponent from '@/component/shared/Forms/FormComponent'
import { useRouter } from 'next/router'

const FormSlug = () => {
  const router = useRouter()
  return (
    <section className='profile_main_wrap py-0 popup_form'>
      <Container>
        <div className='account_row justify-content-center'>
          <div className='account_content_right ms-0 full_width_panel'>
            <div className='p-0 px-0 my-account-form'>
              <Card className='border-0 blog-detail-card'>
                <Card.Body className='pb-sm-4'>
                  <FormComponent
                    formCategoryType={router?.query?.slug}
                    formView={true}
                  />
                </Card.Body>
              </Card>
            </div>{' '}
          </div>
        </div>
      </Container>
    </section>
  )
}

export default FormSlug
