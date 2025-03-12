'use client'

import React, { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'

const ThankYou = () => {
  const searchParams = useSearchParams()
  const [loader, setLoader] = useState(false)
  const search = searchParams.get('transactionId')
  const router = useRouter()
  const { transactionId } = router.query
  const decodedString = tryDecodeBase64(transactionId)

  if (decodedString !== null) {
    console.log('Decoded String:', decodedString)
  } else {
    console.error('Invalid base64-encoded string')
  }

  function tryDecodeBase64 (encodedString) {
    try {
      return atob(encodedString)
    } catch (error) {
      console.error('Error decoding base64 string:', error)
      return null
    }
  }

  useEffect(() => {
    setTimeout(() => {
      setLoader(true)
    }, 100)
  }, [search])

  if (loader) {
    if (search) {
      return (
        <div className='thank-you-page'>
          <Container>
            <div className='thank-you-page-box'>
              <figure className='success_tic mt-3'>
                <Image
                  src='/images/success.svg'
                  width={56}
                  height={56}
                  alt=''
                />
              </figure>
              <figcaption>
                <strong className='d-block my-3 text-center text-black text-lg'>
                  Success !
                </strong>
                <span>
                  Reference Id <strong>{decodedString}</strong>
                </span>
                <p>
                  Thanks for choosing us, we will share the details on
                  registered email{' '}
                </p>
                <Link href='/' className='theme_md_blue_btn mt-3'>
                  OK
                </Link>
              </figcaption>
            </div>
          </Container>
        </div>
      )
    } else {
      return (
        <div className='thank-you-page text-center'>
          <Container>
            <h2 className='text-danger mb-4 text-center'>
              <strong>Sorry!! Your Payment was not successful !</strong>
            </h2>
            <Link href='/' className='theme_md_blue _btn mt-3'>
              Go to Homepage
            </Link>
          </Container>
        </div>
      )
    }
  }
}
export default ThankYou
