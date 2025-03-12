import { apiGet } from '@/utils/apiFetch'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import apiPath from '@/utils/pathObj'
import useToastContext from '@/hooks/useToastContext'
import { Container } from 'react-bootstrap'

const TermsCondition = () => {
  const router = useRouter()
  const notification = useToastContext()
  const [content, setContent] = useState('')
  const getContent = async () => {
    const { status, data } = await apiGet(apiPath.getContent, {
      publicSlug: 'terms-and-conditions'
    })
    if (status === 200) {
      if (data.success) {
        setContent(data.results)
      } else {
        notification.error(data?.message)
      }
    } else {
      notification.error(data?.message)
    }
  }
  useEffect(() => {
    getContent()
  }, [router.query])
  return (
    <>
      <div className='main_wrap blog_detail'>
        <Container>
          <div className='blog-detail-card'>
            <div className='border-0 blog-detail-card card'>
              <figure>
                <img
                  class='card-img card-img-top w-100'
                  src={content?.StaticContentImage}
                />
              </figure>
              <div className='pb-sm-4 card-body'>
                <h2 className='mb-3 mb-lg-4'>Terms and conditions</h2>
                <p
                  dangerouslySetInnerHTML={{ __html: content?.description }}
                ></p>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  )
}
export default TermsCondition
