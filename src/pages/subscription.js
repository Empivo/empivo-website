import React, { useContext, useEffect, useState } from 'react'
import apiPath from '../utils/pathObj'
import { apiGet } from '../utils/apiFetch'
import { useRouter } from 'next/router'
import AuthContext from '@/context/AuthContext'
import { Container, Col, Row } from 'react-bootstrap'
import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'

const Subscription = () => {
  const router = useRouter()
  const [pagination, setPagination] = useState()
  const [page, setPage] = useState(1)
  const [filterData] = useState({
    category: '',
    searchkey: '',
    isReset: false,
    isFilter: false
  })
  const [pageRecord] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  })
  const { setSubscriptionID } = useContext(AuthContext)
  const [subscriptionList, setSubscriptionList] = useState([])

  // Static data for banner and features
  const allPlansInclude = [
    {
      icon: '/images/planincimg1.png',
      title: 'Unlimited jobs and users'
    },
    {
      icon: '/images/planincimg2.png',
      title: 'Customizable hiring steps and templates'
    },
    {
      icon: '/images/planincimg3.png',
      title: 'Advanced search, tagging and team collaboration tools'
    },
    {
      icon: '/images/planincimg4.png',
      title: 'Hireology iOS and Android mobile app'
    },
    {
      icon: '/images/planincimg5.png',
      title: 'New customer onboarding'
    },
    {
      icon: '/images/planincimg6.png',
      title: 'Email and phone support'
    }
  ]

  const getSubscriptionList = async (pageNumber = pageRecord.page) => {
    try {
      let condi = {
        page: pageNumber || 1
      }
      var path = apiPath.getSubscriptionList
      const result = await apiGet(path, condi)
      var response = result?.data?.results
      setSubscriptionList([...subscriptionList, ...response.docs])
      setPagination(response)
    } catch (error) {
      console.log('error:', error)
    }
  }

  const loadMore = () => {
    setPage(page + 1)
    getSubscriptionList(page + 1)
  }

  useEffect(() => {
    getSubscriptionList()
  }, [filterData])

  return (
    <>

      <Head>
        <title>Subscription Plans | Empivo</title>
        <meta name="description" content="Empivo offers flexible subscription plans tailored to meet the diverse needs of businesses of all sizes." />
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin></link>
        <link href="https://fonts.googleapis.com/css2?family=Antonio:wght@100..700&display=swap" rel="stylesheet"></link>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
      </Head>

      <div className="inner_banner subs_banner">
        <div className="subs_bannerleftimg">
          <Image src="/images/subs_bannerlinesleft.png" alt="Banner Left Design" width={200} height={400} />
        </div>
        <div className="subs_bannerrightimg">
          <Image src="/images/subs_bannerlinesright.png" alt="Banner Right Design" width={200} height={400} />
        </div>
        <Container>
          <div className="row">
            <div className="col-md-12">
              <div className="inner_bannerleft">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link href="/">Home</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Subscription
                    </li>
                  </ol>
                </nav>
                <div className="row justify-content-center text-center">
                  <div className="col-md-9">
                    <div className="innertitle">
                      <h1>Subscription <span>Plans</span></h1>
                      <p>
                        Empivo offers flexible subscription plans tailored to meet the diverse needs of businesses of all sizes. Whether you're a small startup, a growing mid-sized company, or a large enterprise, we have a plan that fits your requirements and budget. Choose the plan that best suits your organization's needs:
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <div className=" blog-main">
        <section className="susb_pkg">
          <Container>
            <Row className="gy-4">
              {subscriptionList.map((item, i) => (
                <Col key={i} md={4}>
                  <div className={`subspkg_box ${i === 1 ? 'highlight_subspkg' : ''}`}>
                    <div className="subs_pkgtop">
                      <div className="subspkg_typ">
                        <h6>{item.name.split(' ')[0]} <span>{item.name.split(' ').slice(1).join(' ')}</span></h6>
                      </div>
                      <div className="subs_price">
                        <h4>
                          {item.amount ? (
                            <>
                              <i className="fa-brands fa-dollar-sign"></i>${item.amount}
                               <span>Starting price /mo</span>
                            </>
                          ) : (
                            <>
                              Custom <span>Starting price /mo</span>
                            </>
                          )}
                        </h4>
                      </div>
                      <p>{item.shortDescription || 'Everything your team needs to get started with our powerful feature suite'}</p>
                      <Link
                        href="/user-form"
                        className="subs_started"
                        onClick={() => {
                          if (typeof window !== 'undefined') {
                            localStorage.setItem('subscriptionID', item._id)
                          }
                          setSubscriptionID(item._id)
                        }}
                      >
                        Get Started
                      </Link>
                    </div>
                    <div className="subs_pkgbottom">
                      <div className="subs_featheadp">
                        <h5>Most popular {i > 0 ? 'features' : 'feature'}</h5>
                        {i > 0 && (
                          <span style={{ fontWeight: 400, fontSize: '14px' }}>
                            Everything in {i === 1 ? 'Essentials' : 'Professional'}, plus:
                          </span>
                        )}
                      </div>
                      <ul>
                        {item.description.map((feature, idx) => (
                          <li key={idx}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        <section className="subs_planinc plnsinclude">
          <Container>
            <Row>
              <Col md={12}>
                <div className="innertitle text-center">
                  <h1>All plans <span>include</span></h1>
                </div>
              </Col>
            </Row>
            <Row className="g-4 mt-3">
              {allPlansInclude.map((item, index) => (
                <Col key={index} md={4}>
                  <div className="planinc_box">
                    <Row className="g-0">
                      <Col md={3} xs={3}>
                        <div className="planinc_icon">
                          <Image src={item.icon} alt={item.title} width={50} height={50} />
                        </div>
                      </Col>
                      <Col md={9} xs={9}>
                        <div className="planinc_txt">
                          <h5>{item.title}</h5>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        <section className="cta1">
          <Container>
            <Row className="g-0 align-items-center">
              <Col md={8}>
                <div className="cta1left">
                  <h3>Schedule your free demo</h3>
                  <p>Learn how Empivo can help you attract and hire talent fast</p>
                </div>
              </Col>
              <Col md={4}>
                <div className="cta1right">
                  <Link href="/contact-us">get in touch</Link>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        <section className="serach_result">
          <Container>
            {pagination?.hasNextPage && page <= pagination?.page && (
              <div className="text-center pt-3 pt-md-5">
                <button
                  className="theme_lg_btn text-decoration-none subscription-btn"
                  onClick={() => loadMore()}
                >
                  Load more
                </button>
              </div>
            )}
          </Container>
        </section>
      </div>
    </>
  )
}

export default Subscription