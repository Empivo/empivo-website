import Image from 'next/image'
import React from 'react'
import Head from "next/head";
import Link from 'next/link'
import { Col, Container, Row } from 'react-bootstrap'

const EmpivoFeature = () => {
  return (
    <>
    <Head>
    <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin></link>
        <link href="https://fonts.googleapis.com/css2?family=Antonio:wght@100..700&display=swap" rel="stylesheet"></link>
    </Head>
      {/* Banner Section */}
      <div className="inner_banner product_banner">
        <Container>
          <Row>
            <Col md={4}>
              <div className="inner_bannerleft">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link href="/">Home</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Empivo Feature
                    </li>
                  </ol>
                </nav>
                <div className="innertitle">
                  <h1>
                    Product <span>Page</span>
                  </h1>
                  <p>
                    Empivo presents a comprehensive platform featuring a diverse
                    array of functionalities meticulously designed to cater to the
                    modern business landscape:
                  </p>
                </div>
              </div>
            </Col>
            <Col md={8}>
            <div className="inner_bannerright">
                <Image
                  src="images/featureScreen.png"
                  width={800}
                  height={500}
                  className="images-fluid"
                  alt="Product Banner"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Feature Section */}
      <div className="env_feature">
        <Container>
          <Row className="align-items-center">
            <Col lg={3} md={4}>
              <div className="left_circle">
                <div className="circle_line" />
                <div className="circle_inner">
                  <Image
                    src="/images/empivo.png"
                    width={150}
                    height={150}
                    className="images-fluid"
                    alt="Empivo Logo"
                  />
                  <Image
                    src="/images/feature.png"
                    width={150}
                    height={150}
                    className="images-fluid"
                    alt="Feature"
                  />
                </div>
              </div>
            </Col>
            <Col lg={9} md={8}>
              <div className="feature_points">
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                  {/* Feature Items */}
                  <li>
                    <Row className="align-items-center">
                      <Col lg={3} md={4}>
                        <div className="feature_icon">
                          <div className="feature_iconinner">
                            <div className="feature_iconbox">
                              <Image
                                src="/images/feat_icon1.png"
                                width={50}
                                height={50}
                                className="images-fluid"
                                alt="ATS Icon"
                              />
                            </div>
                          </div>
                        </div>
                      </Col>
                      <Col lg={9} md={8}>
                        <div className="feature_content">
                          <h4>Applicant Tracking System (ATS):</h4>
                          <p>
                            Our ATS enables end-to-end management of the hiring
                            process, encompassing tasks such as job creation,
                            candidate evaluation, and integration with prominent job
                            boards to facilitate the acquisition of top-tier talent.
                          </p>
                        </div>
                      </Col>
                    </Row>
                  </li>

                  <li>
                    <Row className="align-items-center">
                      <Col lg={3} md={4}>
                        <div className="feature_icon">
                          <div className="feature_iconinner">
                            <div className="feature_iconbox">
                              <Image
                                src="/images/feat_icon2.png"
                                width={50}
                                height={50}
                                className="images-fluid"
                                alt="Onboarding Icon"
                              />
                            </div>
                          </div>
                        </div>
                      </Col>
                      <Col lg={9} md={8}>
                        <div className="feature_content">
                          <h4>Onboarding:</h4>
                          <p>
                            Simplify the onboarding journey with Empivo's suite of
                            HR forms and automated employee reminders, ensuring a
                            seamless transition for new hires and fostering early
                            success within the organization.
                          </p>
                        </div>
                      </Col>
                    </Row>
                  </li>

                  <li>
                    <Row className="align-items-center">
                      <Col lg={3} md={4}>
                        <div className="feature_icon">
                          <div className="feature_iconinner">
                            <div className="feature_iconbox">
                              <Image
                                src="/images/feat_icon3.png"
                                width={50}
                                height={50}
                                className="images-fluid"
                                alt="Time and Attendance Icon"
                              />
                            </div>
                          </div>
                        </div>
                      </Col>
                      <Col lg={9} md={8}>
                        <div className="feature_content">
                          <h4>Time and Attendance:</h4>
                          <p>
                            Ensure precision and efficiency in tracking employee
                            hours with our time and attendance feature, thereby
                            simplifying payroll processing and ensuring adherence to
                            labor regulations.
                          </p>
                        </div>
                      </Col>
                    </Row>
                  </li>

                  <li>
                    <Row className="align-items-center">
                      <Col lg={3} md={4}>
                        <div className="feature_icon">
                          <div className="feature_iconinner">
                            <div className="feature_iconbox">
                              <Image
                                src="/images/feat_icon4.png"
                                width={50}
                                height={50}
                                className="images-fluid"
                                alt="Accounting Icon"
                              />
                            </div>
                          </div>
                        </div>
                      </Col>
                      <Col lg={9} md={8}>
                        <div className="feature_content">
                          <h4>Accounting:</h4>
                          <p>
                            Seamlessly merge your HR data with existing accounting
                            systems to streamline financial management, ensuring
                            consistency and accuracy across all operational facets.
                          </p>
                        </div>
                      </Col>
                    </Row>
                  </li>

                  <li>
                    <Row className="align-items-center">
                      <Col lg={3} md={4}>
                        <div className="feature_icon">
                          <div className="feature_iconinner">
                            <div className="feature_iconbox">
                              <Image
                                src="/images/feat_icon5.png"
                                width={50}
                                height={50}
                                className="images-fluid"
                                alt="Biometrics Icon"
                              />
                            </div>
                          </div>
                        </div>
                      </Col>
                      <Col lg={9} md={8}>
                        <div className="feature_content">
                          <h4>Biometrics:</h4>
                          <p>
                            Elevate security measures and accuracy levels with
                            Empivo's biometric authentication, fortifying sensitive
                            data and thwarting unauthorized access through advanced
                            biometric technology. Empivo seamlessly integrates with
                            other major systems, including payroll processing and
                            criminal background check platforms, ensuring a cohesive
                            and uninterrupted HR experience.
                          </p>
                        </div>
                      </Col>
                    </Row>
                  </li>

                  {/* Additional Feature Items */}
                  {[
                    { icon: 'feat_icon6.png', title: 'Streamlined Applicant Tracking:', description: 'From the moment a position opens up to the final hiring decision, Empivo\'s Applicant Tracking System (ATS) streamlines the entire process. Create job postings, evaluate candidates, and seamlessly integrate with top job boards to acquire the best talent effortlessly.' },
                    { icon: 'feat_icon7.png', title: 'Effortless Onboarding:', description: 'Simplify the onboarding journey for new hires with Empivo\'s suite of HR forms and automated reminders. Ensure a smooth transition into your organization, fostering early success and engagement from day one.' },
                    { icon: 'feat_icon8.png', title: 'Precise Time and Attendance Tracking:', description: 'Say goodbye to manual timekeeping errors and cumbersome spreadsheets. Empivo\'s Time and Attendance feature ensures precision in tracking employee hours, simplifying payroll processing and ensuring compliance with labor regulations.' },
                    { icon: 'feat_icon9.png', title: 'Seamless Integration with Accounting:', description: 'Merge your HR data seamlessly with your existing accounting systems for streamlined financial management. Empivo ensures consistency and accuracy across all operational facets, freeing up valuable time for strategic initiatives.' },
                    { icon: 'feat_icon10.png', title: 'Enhanced Security with Biometrics:', description: 'Elevate your security measures with Empivo\'s advanced biometric authentication. Protect sensitive data and thwart unauthorized access with cutting-edge technology.' }
                  ].map((feature, index) => (
                    <li key={index}>
                      <Row className="align-items-center">
                        <Col lg={3} md={4}>
                          <div className="feature_icon">
                            <div className="feature_iconinner">
                              <div className="feature_iconbox">
                                <Image
                                  src={`/images/${feature.icon}`}
                                  width={50}
                                  height={50}
                                  className="images-fluid"
                                  alt={`${feature.title} Icon`}
                                />
                              </div>
                            </div>
                          </div>
                        </Col>
                        <Col lg={9} md={8}>
                          <div className="feature_content">
                            <h4>{feature.title}</h4>
                            <p>{feature.description}</p>
                          </div>
                        </Col>
                      </Row>
                    </li>
                  ))}
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* CTA Section */}
      <div className="cta1">
        <Container>
          <Row className="g-0 align-items-center">
            <Col md={8}>
              <div className="cta1left">
                <h3>Schedule your free demo</h3>
                <p>Learn how Hireology can help you attract and hire talent fast</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="cta1right">
              <Link href="/contact-us">get in touch</Link>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  )
}

export default EmpivoFeature