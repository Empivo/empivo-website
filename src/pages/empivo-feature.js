import Image from 'next/image'
import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'

const EmpivoFeature = () => {
  return (
    <>
      <div className='main_wrap blog-main'>
        <Container>
          <div className='border-0 blog-detail-card card'>
            <div className='AboutSection'>
              <Row className='align-items-center'>
                <Col lg={6}>
                  <figure>
                    <Image
                      src='images/featureScreen.png'
                      width='819'
                      height='547'
                      alt=''
                    />
                  </figure>
                </Col>

                <Col lg={6}>
                  <article className='section_head featureMainCaption px-md-3'>
                    <h2 className='text-black text-xl '>
                      Product
                      <span className='text-orange'> Page</span>
                    </h2>

                    <p className='mt-3'>
                      Empivo presents a comprehensive platform featuring a
                      diverse array of functionalities meticulously designed to
                      cater to the modern business landscape:
                    </p>
                  </article>
                </Col>
              </Row>
            </div>

            <div className='featureGridWRap'>
              <div className=''>
                <Row className=''>
                  <Col lg={6} className='d-flex'>
                    <div className='border FeatureGrid'>
                      <span className='iconCorner'>
                        <Image
                          src='images/Tracking.png'
                          width={50}
                          height={50}
                          alt=''
                        />
                      </span>
                      <div className='w-100'>
                        <h5 className='mb-3 text-black'>
                          Applicant Tracking System (ATS):{' '}
                        </h5>
                        <p className='mb-0'>
                          Our ATS enables end-to-end management of the hiring
                          process, encompassing tasks such as job creation,
                          candidate evaluation, and integration with prominent
                          job boards to facilitate the acquisition of top-tier
                          talent.
                        </p>
                      </div>
                    </div>
                  </Col>
                  <Col lg={6} className='d-flex'>
                    <div className='border FeatureGrid'>
                      <span className='iconCorner'>
                        <Image
                          src='images/Onboarding.png'
                          width={50}
                          height={50}
                          alt=''
                        />{' '}
                      </span>
                      <div className='w-100'>
                        <h5 className='mb-3 text-black'>Onboarding:</h5>
                        <p className='mb-0'>
                          Simplify the onboarding journey with Empivo&apos;s
                          suite of HR forms and automated employee reminders,
                          ensuring a seamless transition for new hires and
                          fostering early success within the organization.
                        </p>
                      </div>
                    </div>
                  </Col>
                  <Col lg={6} className='d-flex'>
                    <div className='border FeatureGrid'>
                      <span className='iconCorner'>
                        <Image
                          src='images/Attendance.png'
                          width={50}
                          height={50}
                          alt=''
                        />{' '}
                      </span>
                      <div className='w-100'>
                        <h5 className='mb-3 text-black'>
                          Time and Attendance:
                        </h5>
                        <p className='mb-0'>
                          Ensure precision and efficiency in tracking employee
                          hours with our time and attendance feature, thereby
                          simplifying payroll processing and ensuring adherence
                          to labor regulations.
                        </p>
                      </div>
                    </div>
                  </Col>
                  <Col lg={6} className='d-flex'>
                    <div className='border FeatureGrid'>
                      <span className='iconCorner'>
                        <Image
                          src='images/Accounting.png'
                          width={50}
                          height={50}
                          alt=''
                        />
                      </span>
                      <div className='w-100'>
                        <h5 className='mb-3 text-black'>Accounting:</h5>
                        <p className='mb-0'>
                          Seamlessly merge your HR data with existing accounting
                          systems to streamline financial management, ensuring
                          consistency and accuracy across all operational
                          facets.
                        </p>
                      </div>
                    </div>
                  </Col>
                  <Col lg={6} className='d-flex'>
                    <div className='border FeatureGrid'>
                      <span className='iconCorner'>
                        <Image
                          src='images/Biometrics.png'
                          width={50}
                          height={50}
                          alt=''
                        />
                      </span>
                      <div className='w-100'>
                        <h5 className='mb-3 text-black'>Biometrics:</h5>
                        <p className='mb-0'>
                          Elevate security measures and accuracy levels with
                          Empivo&apos;s biometric authentication, fortifying
                          sensitive data and thwarting unauthorized access
                          through advanced biometric technology. Empivo
                          seamlessly integrates with other major systems,
                          including payroll processing and criminal background
                          check platforms, ensuring a cohesive and uninterrupted
                          HR experience.
                        </p>
                      </div>
                    </div>
                  </Col>
                  <Col lg={6} className='d-flex'>
                    <div className='border FeatureGrid'>
                      <span className='iconCorner'>
                        <Image
                          src='images/Streamlined Applicant Tracking.png'
                          width={50}
                          height={50}
                          alt=''
                        />
                      </span>
                      <div className='w-100'>
                        <h5 className='mb-3 text-black'>
                          Streamlined Applicant Tracking:
                        </h5>
                        <p className='mb-0'>
                          From the moment a position opens up to the final
                          hiring decision, Empivo&#39;s Applicant Tracking
                          System (ATS) streamlines the entire process. Create
                          job postings, evaluate candidates, and seamlessly
                          integrate with top job boards to acquire the best
                          talent effortlessly.
                        </p>
                      </div>
                    </div>
                  </Col>
                  <Col lg={6} className='d-flex'>
                    <div className='border FeatureGrid'>
                      <span className='iconCorner'>
                        <Image
                          src='images/Effortless Onboarding.png'
                          width={50}
                          height={50}
                          alt=''
                        />
                      </span>
                      <div className='w-100'>
                        <h5 className='mb-3 text-black'>
                          Effortless Onboarding:
                        </h5>
                        <p className='mb-0'>
                          Simplify the onboarding journey for new hires with
                          Empivo&#39;s suite of HR forms and automated
                          reminders. Ensure a smooth transition into your
                          organization, fostering early success and engagement
                          from day one.
                        </p>
                      </div>
                    </div>
                  </Col>
                  <Col lg={6} className='d-flex'>
                    <div className='border FeatureGrid'>
                      <span className='iconCorner'>
                        <Image
                          src='images/Precise Time and Attendance Tracking.png'
                          width={50}
                          height={50}
                          alt=''
                        />
                      </span>
                      <div className='w-100'>
                        <h5 className='mb-3 text-black'>
                          Precise Time and Attendance Tracking:
                        </h5>
                        <p className='mb-0'>
                          Say goodbye to manual timekeeping errors and
                          cumbersome spreadsheets. Empivo&#39;s Time and
                          Attendance feature ensures precision in tracking
                          employee hours, simplifying payroll processing and
                          ensuring compliance with labor regulations.
                        </p>
                      </div>
                    </div>
                  </Col>
                  <Col lg={6} className='d-flex'>
                    <div className='border FeatureGrid'>
                      <span className='iconCorner'>
                        <Image
                          src='images/Seamless Integration with Accounting.png'
                          width={50}
                          height={50}
                          alt=''
                        />
                      </span>
                      <div className='w-100'>
                        <h5 className='mb-3 text-black'>
                          Seamless Integration with Accounting:
                        </h5>
                        <p className='mb-0'>
                          Merge your HR data seamlessly with your existing
                          accounting systems for streamlined financial
                          management. Empivo ensures consistency and accuracy
                          across all operational facets, freeing up valuable
                          time for strategic initiatives.
                        </p>
                      </div>
                    </div>
                  </Col>
                  <Col lg={6} className='d-flex'>
                    <div className='border FeatureGrid'>
                      <span className='iconCorner'>
                        <Image
                          src='images/Enhanced Security with Biometrics.png'
                          width={50}
                          height={50}
                          alt=''
                        />
                      </span>
                      <div className='w-100'>
                        <h5 className='mb-3 text-black'>
                          Enhanced Security with Biometrics:
                        </h5>
                        <p className='mb-0'>
                          Elevate your security measures with Empivo&#39;s
                          advanced biometric authentication. Protect sensitive
                          data and thwart unauthorized access with cutting-edge
                          technology.
                        </p>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  )
}
export default EmpivoFeature
