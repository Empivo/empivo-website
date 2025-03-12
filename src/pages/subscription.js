import React, { useContext, useEffect, useState } from 'react'
import apiPath from '../utils/pathObj'
import { apiGet } from '../utils/apiFetch'
import { useRouter } from 'next/router'
import AuthContext from '@/context/AuthContext'
import { Container, Col, Row } from 'react-bootstrap'
import Link from 'next/link'

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
    <div className='main_wrap blog-main'>
      <section className='serach_result'>
        <Container>
          <div className='inner_heading mb-md-0 mb-3'>
            <strong className='fw-bold mb-3 text-dark d-block text-lg'>
              {pagination?.totalDocs} results
            </strong>
          </div>
          <Row className='all_package justify-content-center'>
            {subscriptionList &&
              subscriptionList.map((item, i) => {
                return (
                  <Col key={i} lg={4} md={6}>
                    <div className='mx-0 h-100' key={i}>
                      <div className='plan_grid mx-0'>
                        <div className='plan_value'>
                          <small className='text-black'>{item?.name}</small>
                          <strong className='text-blue'>${item?.amount}</strong>
                          <span>{item?.duration} Days</span>
                        </div>
                        <div className='plan_numbers mt-2'>
                          <ul>
                            <li>
                              Number of Employees
                              <span> {item?.noOfEmployee}</span>
                            </li>
                            <li>
                              Number of HRs<span> {item?.noOfHR}</span>
                            </li>
                            <li>
                              {' '}
                              Number of Accountants
                              <span> {item?.noOfAccountant}</span>
                            </li>
                          </ul>
                        </div>
                        <div className='plan_feature_list'>
                          <ul className='theme_list_point'>
                            {item?.description?.map((line, index) => (
                              <li key={line + index}>{line}</li>
                            ))}
                          </ul>
                        </div>
                        <Link
                          onClick={() => {
                            router.push('/user-form')
                            if (typeof window !== 'undefined')
                              localStorage.setItem('subscriptionID', item?._id)
                            setSubscriptionID(item?._id)
                          }}
                          href='/user-form'
                          className='theme_lg_btn bg_theme_blue btn btn-primary d-block mt-3 w-100'
                        >
                          Get Started
                        </Link>
                      </div>
                    </div>
                  </Col>
                )
              })}
          </Row>
          {pagination?.hasNextPage && page <= pagination?.page && (
            <div className='text-center pt-3 pt-md-5'>
              <button
                className='theme_lg_btn text-decoration-none subscription-btn'
                onClick={() => loadMore()}
              >
                {' '}
                Load more
              </button>
            </div>
          )}
        </Container>
      </section>
    </div>
  )
}
export default Subscription
