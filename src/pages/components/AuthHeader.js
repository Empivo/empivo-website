import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Container, Navbar } from 'react-bootstrap'

function AuthHeader () {
  return (
    <div>
      <div className='header position-relative'>
        <Navbar expand='md'>
          <Container className='justify-content-between'>
            <Navbar.Brand href='/' as={Link}>
              <Image
                width={213}
                height={54}
                src='images/logo.svg'
                alt=''
                className='wow slideInUp'
                data-wow-delay='5s'
                data-wow-duration='2s'
              />
            </Navbar.Brand>
          </Container>
        </Navbar>
      </div>
    </div>
  )
}

export default AuthHeader
