import React, { useContext, useEffect, useState } from 'react'
import { Container, Row } from 'react-bootstrap'
import apiPath from '../utils/pathObj'
import { apiGet } from '../utils/apiFetch'
import Link from 'next/link'
import AuthContext from '@/context/AuthContext'

function StaticContent () {
  const [contentData, setContentData] = useState([])
  const [pagination, setPagination] = useState()
  const [page, setPage] = useState(1)
  const { config } = useContext(AuthContext)
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

  const getSlug = slug => {
    const obj = config?.staticContent?.find(s => s.slug === slug)
    return `/pages/${obj?.publicSlug}`
  }

  const staticContentList = async (pageNumber = pageRecord.page) => {
    try {
      let condi = {
        page: pageNumber || 1
      }
      var path = apiPath.getStatic
      const result = await apiGet(path, condi)
      var response = result?.data?.results
      setContentData([...contentData, ...response.docs])
      setPagination(response)
    } catch (error) {
      console.log('error in get all static list==>>>>', error.message)
    }
  }

  const loadMore = () => {
    setPage(page + 1)
    staticContentList(page + 1)
  }

  useEffect(() => {
    staticContentList()
  }, [filterData])

  return (
    <div className='main_wrap blog-main'>
      <section className='serach_result'>
        <Container>
          <Row className='gy-3'>
            {contentData?.length > 0 &&
              contentData?.map((item, index) => {
                return (
                  <div key={index} className='static-menu'>
                    <Link
                      href={getSlug(item.slug)}
                      className='categoery_outer transition'
                    >
                      <div>
                        <h5 className='text-black'>{item?.title}</h5>
                      </div>
                    </Link>
                  </div>
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
export default StaticContent
