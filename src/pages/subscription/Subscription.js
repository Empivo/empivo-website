import React, { useContext, useEffect, useState } from 'react'
import apiPath from '../../utils/pathObj'
import { apiGet } from '../../utils/apiFetch'
import { useRouter } from 'next/router'
import AuthContext from '@/context/AuthContext'
import Link from 'next/link'
import { Col, Row } from 'react-bootstrap'
import { isEmpty } from 'lodash'

const Subscription = () => {
  const router = useRouter()
  const [page] = useState(1)
  const [pageSize] = useState(3)
  const { initialData, setCompanyDetails, setSubscriptionID } =
    useContext(AuthContext)
  const [subscriptionList, setSubscriptionList] = useState([])

  const getSubscriptionList = async () => {
    try {
      const payload = {
        page,
        pageSize
      }
      const res = await apiGet(apiPath.getSubscriptionList, payload)
      setSubscriptionList(res?.data?.results?.docs)
    } catch (error) {
      console.log('error:', error)
    }
  }

  useEffect(() => {
    getSubscriptionList()
  }, [page])

  return (
    <>
      <Row className='all_package justify-content-center'>
        {subscriptionList &&
          subscriptionList?.map((item, i) => {
            return (
              <Col lg={4} md={6} key={i} className='d-flex'>
                <div className='mx-0 mx-md-2 w-100'>
                  <div className='plan_grid'>
                    <div className='plan_value'>
                      <small className='text-black'>{item?.name}</small>
                      <strong className='text-blue'>${item?.amount}</strong>
                      <span>{item?.duration} Days</span>
                    </div>

                    <div className='plan_numbers mt-2'>
                      <ul>
                        <li>
                          Number of Employees<span> {item?.noOfEmployee}</span>
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
                        if (typeof window !== 'undefined') {
                          localStorage.setItem('subscriptionID', item?._id)
                          localStorage.removeItem('company')
                        }
                        setSubscriptionID(item?._id)
                        setCompanyDetails(initialData)
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
      {isEmpty(subscriptionList) ? (
        <div className='bg-white border-b text-center dark:bg-gray-800 dark:border-gray-700'>
          <p className='py-4 px-6 border-r'>No subscription data found</p>
        </div>
      ) : (
        <div className='text-center pt-3 pt-md-5'>
          <Link
            href='/subscription'
            className='theme_lg_btn text-decoration-none subscription-btn d-inline-block'
          >
            View All subscription
          </Link>
        </div>
      )}
      {/* </Slider> */}
    </>
  )
}
export default Subscription
