import Link from 'next/link'
import React from 'react'
import { Row, Col } from 'react-bootstrap'

function AuthFooter () {
  return (
    <div className='auth_footer'>
      <Row>
        <Col md={8}>
          <div className='auth_link'>
            <Link target='_blank' href='/TermsCondition' className='text-link'>
              Terms & Conditions
            </Link>
            <Link target='_blank' href='/privacyPolicy' className='text-link'>
              Privacy Policy
            </Link>
            <Link target='_blank' href='/contact-us' className='text-link'>
              Contact us
            </Link>
          </div>
        </Col>
        <Col md={4}>
          <div className='auth_copyright text-center text-md-end fw-600'>
            © copyright empivo.com
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default AuthFooter
